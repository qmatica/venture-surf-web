import {
  collection, getDocs, query, onSnapshot
} from 'firebase/firestore'
import * as UpChunk from '@mux/upchunk'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { profileAPI, usersAPI } from 'api'
import { init as initSurf } from 'features/Surf/actions'
import { actions as actionsConversations, listenMessages, sendMessage } from 'features/Conversations/actions'
import { actions as actionsVideoChat, connectToVideoRoom } from 'features/VideoChat/actions'
import { actions as actionsNotifications } from 'features/Notifications/actions'
import { actions as actionsContacts } from 'features/Contacts/actions'
import { ValueNotificationsHistoryType } from 'features/Notifications/types'
import { FormattedSlotsType } from 'features/Calendar/types'
import { UsersType, UserType } from 'features/User/types'
import { ChatType } from 'features/Conversations/types'
import { RoleType } from 'features/Profile/types'
import { addToClipboardPublicLinkProfile } from 'common/actions'
import { determineNotificationContactsOrCall } from 'common/typeGuards'
import { executeAllPromises, isNumber } from 'common/utils'
import { VOIP_TOKEN, BUNDLE } from 'common/constants'
import { apiCodes } from 'common/types'

import {
  JobType,
  ResponseCallNowType,
  ThunkType,
  onSnapshotVideoType,
  ProfileType,
  ResultCompareContactsType,
  ContactsListType,
  ResultCompareInstanceCallType,
  SlotsType
} from './types'
import { compareCountContacts, getTokenFcm } from './utils'

export const actions = {
  setMyProfile: (profile: any) => ({ type: 'PROFILE__SET_MY_PROFILE', profile } as const),
  updateMyProfilePhoto: (photoURL: string) => ({ type: 'PROFILE__UPDATE_MY_PROFILE_PHOTO', photoURL } as const),
  updateMyContacts: (updatedUsers: any) => ({ type: 'PROFILE__UPDATE_MY_CONTACTS', updatedUsers } as const),
  addUserInMyContacts: (user: UserType, contacts: 'mutuals' | 'likes' | 'liked') => (
    { type: 'PROFILE__ADD_USER_IN_MY_CONTACTS', payload: { user, contacts } } as const
  ),
  removeUserInMyContacts: (user: UserType, contacts: 'mutuals' | 'likes' | 'liked') => (
    { type: 'PROFILE__REMOVE_USER_IN_MY_CONTACTS', payload: { user, contacts } } as const
  ),
  updateUserInMyContacts: (user: UserType, contacts: 'mutuals' | 'likes' | 'liked') => (
    { type: 'PROFILE__UPDATE_USER_IN_MY_CONTACTS', payload: { user, contacts } } as const
  ),
  setIsActiveFcm: (isActiveFcm: boolean) => ({ type: 'PROFILE__SET_IS_ACTIVE_FCM', isActiveFcm } as const),
  setProgressLoadingFile: (progressLoadingFile: number | null) => (
    { type: 'PROFILE__SET_PROGRESS_FILE', progressLoadingFile } as const
  ),
  toggleLoader: (loader: string) => (
    { type: 'PROFILE__TOGGLE_LOADER', loader } as const
  ),
  updateMySlots: (action: 'add' | 'del' | 'disable' | 'enable', slot: string | SlotsType) => (
    { type: 'PROFILE__UPDATE_MY_SLOTS', payload: { action, slot } } as const
  ),
  addChatInMutual: (uid: string, chat: string) => (
    { type: 'PROFILE__ADD_CHAT_IN_MUTUAL', payload: { uid, chat } } as const
  ),
  acceptInvest: (uid: string) => ({ type: 'PROFILE__ACCEPT_INVEST', uid } as const),
  addInvests: (investorList: string[]) => ({ type: 'PROFILE__ADD_INVEST', investorList } as const),
  addYourself: (uid: string, selectedRole: 'investments' | 'investors') => ({ type: 'PROFILE__ADD_YOURSELF', payload: { uid, selectedRole } } as const),
  deleteInvest: (uid: string) => ({ type: 'PROFILE__DELETE_INVEST', uid } as const)
}

let activeActions: string[] = []

export const init = (): ThunkType => async (dispatch, getState, getFirebase) => {
  try {
    let deviceId = localStorage.getItem('deviceId')

    if (!deviceId) {
      deviceId = uuidv4()
      localStorage.setItem('deviceId', deviceId)
    }

    const fcm_token = await getTokenFcm()

    if (fcm_token) {
      dispatch(actions.setIsActiveFcm(true))
    }

    const device = {
      id: deviceId,
      os: window.navigator.appVersion,
      fcm_token,
      voip_token: VOIP_TOKEN,
      bundle: BUNDLE
    }

    const profile = await profileAPI.afterLogin(device)

    const { auth: { uid } } = getState().firebase

    const contactsList: any = {
      mutuals: {},
      likes: {},
      liked: {}
    }

    Object.keys(contactsList).forEach((contacts) => {
      Object.keys(profile[contacts]).forEach((key) => {
        contactsList[contacts][key] = {
          ...profile[contacts][key],
          uid: key
        }
      })
    })

    const updatedProfile = {
      ...profile,
      ...contactsList,
      uid,
      currentDeviceId: deviceId
    }
    dispatch(actions.setMyProfile(updatedProfile))

    dispatch(getFullProfiles(contactsList.mutuals, 'mutuals'))

    // if (fcm_token) {
    //   const messaging = getMessaging(firebaseApp)
    //
    //   onMessage(messaging, (payload) => {
    //     console.log('Message received. ', payload)
    //     dispatch(checkIncomingCall(payload))
    //   })
    // }

    dispatch(listenSchedulesMeetings())
    dispatch(listenUpdateMyProfile())

    const q = query(collection(getFirebase().firestore(), `profiles/${uid}/notifications`))

    const querySnapshot = await getDocs(q)

    const notificationsHistory = {} as { [key: string]: ValueNotificationsHistoryType }

    querySnapshot.forEach((doc) => {
      const notify = doc.data() as ValueNotificationsHistoryType
      console.log('notifications', doc.id, ' => ', notify)
      notificationsHistory[doc.id] = notify
    })

    dispatch(actionsNotifications.setHistory(notificationsHistory))
    dispatch(actionsNotifications.setIsLoadedHistory(true))

    let allContacts = {} as { [key: string]: ProfileType }

    Object.values(contactsList).forEach((contactList: any) => {
      allContacts = {
        ...allContacts,
        ...contactList
      }
    })

    const additionalProfiles = {} as { [key: string]: null | ProfileType }

    Object.values(notificationsHistory).forEach((notify) => {
      if (!allContacts[notify.contact]) {
        additionalProfiles[notify.contact] = null
      }
    })

    executeAllPromises(Object.keys(additionalProfiles).map((uid) => usersAPI.getUser(uid))).then((items) => {
      const { errors, results } = items

      results.forEach((res) => {
        additionalProfiles[res.uid] = res
      })

      dispatch(actionsContacts.setAdditionalProfiles(additionalProfiles))
    })

    onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const doc = change.doc.data() as ValueNotificationsHistoryType
          console.log('New: doc', doc)
          if (!notificationsHistory[change.doc.id]) {
            console.log('Unregistered doc!', doc)
            notificationsHistory[change.doc.id] = doc

            dispatch(actionsNotifications.addItemInHistory(change.doc.id, doc))

            // Входящий звонок
            if (notificationsHistory[change.doc.id].type === 'call_instant') {
              const { contact, data: { room, token } } = notificationsHistory[change.doc.id]

              const user = profile.mutuals[contact]

              const name = user.name || user.displayName || `${user.first_name} ${user.last_name}`
              const { photoURL } = user

              const payload = {
                uid: contact,
                name,
                photoURL,
                room,
                token
              }

              dispatch(actionsNotifications.addIncomingCall(payload))
            }

            if (notificationsHistory[change.doc.id].type === 'call_instant_group') {
              const { contact, data: { twilio: { room, token } } } = notificationsHistory[change.doc.id]

              const user = profile.mutuals[contact]

              const name = user.name || user.displayName || `${user.first_name} ${user.last_name}`
              const { photoURL } = user

              const payload = {
                uid: contact,
                name,
                photoURL,
                room,
                token
              }

              dispatch(actionsNotifications.addIncomingCall(payload))
            }

            if (notificationsHistory[change.doc.id].type === 'twilio_enter_group') {
              const { data: { room, token } } = notificationsHistory[change.doc.id]

              dispatch(connectToVideoRoom(room, token))
            }
          }
        }
        if (change.type === 'modified') {
          console.log('Modified doc: ', change.doc.data())
        }
        if (change.type === 'removed') {
          console.log('Removed doc: ', change.doc.data())
        }
      })
    })
  } catch (err) {
    console.log(err)
  }
}

const listenSchedulesMeetings = (): ThunkType => async (dispatch, getState) => {
  const checkStartMeeting = () => {
    const { profile } = getState().profile
    const { scheduledMeetMsgs } = getState().notifications
    const { closedNotify } = getState().calendar

    if (profile) {
      const { slots, mutuals } = profile

      if (slots) {
        const formattedSlots: FormattedSlotsType = []

        Object.entries(slots).forEach(([date, value]) => {
          if (
            date !== 'now'
            && value.status === 'scheduled'
            && moment().format('DD-MM-YYYY') === moment(date).format('DD-MM-YYYY')
            && moment(date).isAfter(moment())
          ) {
            formattedSlots.push({
              date: moment(date).format('YYYY-MM-DDTHH:mm:00'),
              ...value
            })
          }
        })
        const foundedMeeting =
          formattedSlots.find((slot) => {
            const slotDateSubtract = moment(slot.date).subtract(5, 'minutes')
            const slotDate = moment(slot.date)
            const currentDate = moment()

            return slotDateSubtract <= currentDate && slotDate >= currentDate
          })

        if (
          foundedMeeting
          && foundedMeeting.uid
          && !scheduledMeetMsgs.find((msg) => msg.date === foundedMeeting.date)
          && !closedNotify.find((notify) => notify === foundedMeeting.date)
        ) {
          const mutual = mutuals[foundedMeeting.uid]
          const name = mutual.name || mutual.displayName || `${mutual.first_name} ${mutual.last_name}`
          const secondsToMeet = Math.abs(moment().diff(foundedMeeting.date, 'seconds'))

          dispatch(actionsNotifications.addScheduledMeetMsg(
            foundedMeeting.date,
            name,
            foundedMeeting.uid,
            uuidv4(),
            secondsToMeet
          ))
        }
      }
    }
  }

  checkStartMeeting()

  setInterval(() => {
    checkStartMeeting()
  }, 5000)
}

const getFullProfiles = (
  contactsList: UsersType,
  contactsType: 'mutuals' | 'liked' | 'likes'
): ThunkType => async (dispatch) => {
  executeAllPromises(Object.keys(contactsList).map((uid) => usersAPI.getUser(uid))).then((items) => {
    const errors = items.errors.map((err) => err.error.replace('Profile for user ', '').replace(' not found!', ''))
    const { results } = items

    let contacts = {
      [contactsType]: {}
    }

    console.log(`— ${results.length} Promises were successful: `, results)

    results.forEach((user) => {
      contacts = {
        ...contacts,
        [contactsType]: {
          ...contacts[contactsType],
          [user.uid]: {
            ...user,
            ...contactsList[user.uid],
            fullLoaded: true
          }
        }
      }
    })

    dispatch(actions.updateMyContacts(contacts))

    console.log(`— ${items.errors.length} Promises failed: `, errors)
  })
}

// const checkIncomingCall = (payload: IncomingCallType | any): ThunkType => async (dispatch, getState) => {
//   if (payload?.notification?.title === 'Incoming call from') {
//     dispatch(actionsNotifications.addIncomingCall(payload))
//   }
//   if (payload?.data.start_time === 'now') {
//     const data = {
//       data: { ...JSON.parse(payload.data.twilio), uid: payload.data.uid },
//       notification: { body: payload.data.name, title: 'Incoming call from' }
//     }
//     dispatch(actionsNotifications.addIncomingCall(data))
//   }
// }

const listenUpdateMyProfile = (): ThunkType => async (dispatch, getState, getFirebase) => {
  const { auth } = getState().firebase

  getFirebase().firestore().doc(`profiles/${auth.uid}`).onSnapshot(async (doc) => {
    const { profile } = getState().profile
    // const { isOwnerCall } = getState().videoChat
    const newProfile = doc.data() as ProfileType

    console.log('My profile updated: ', newProfile)

    if (profile) {
      const contactsList = ['mutuals', 'likes', 'liked'] as const

      contactsList.forEach((contacts) => {
        const result = compareCountContacts(profile[contacts], newProfile[contacts])
        if (result) {
          if (!profile.isActiveFcm) {
            dispatch(showNotification(result, contacts))
          }
          const { action, contact } = result
          dispatch(actions[action](contact, contacts))
        }
      })

      dispatch(compareChats(profile.mutuals, newProfile.mutuals))

      // const result = compareNowSlot(
      //   profile.slots,
      //   newProfile.slots,
      //   isOwnerCall,
      //   (action: 'add' | 'del' | 'disable' | 'enable', slot: string | SlotsType) => {
      //     dispatch(actions.updateMySlots(action, slot))
      //   }
      // )
      // if (result) {
      //   // @ts-ignore
      //   dispatch(showNotification(result))
      // }
    }
  })
}

const compareChats = (prevMutuals: UsersType, nextMutuals: UsersType): ThunkType => async (dispatch, getState) => {
  let user = null as UserType | null

  Object.keys(nextMutuals).some((key) => {
    if (!prevMutuals[key]?.chat && nextMutuals[key].chat) {
      user = {
        ...nextMutuals[key],
        uid: key
      }
      return true
    }
    return false
  })

  if (!user || !user.chat) return

  if (activeActions.includes(`${user.uid}-chat`)) {
    activeActions = activeActions.filter((uid) => uid !== `${user?.uid}-chat`)
    return
  }

  dispatch(actions.addChatInMutual(user.uid, user.chat))

  const { client } = getState().conversations

  const userName = user.name || user.displayName || `${user.first_name} ${user.last_name}`

  if (client) {
    client.getConversationBySid(user.chat)
      .then(async (conv) => {
        const messages = await conv.getMessages()

        if (user && user.chat) {
          dispatch(actionsConversations.addChat(
            user.chat,
            userName,
            user.photoURL,
            user.photoBase64,
            conv,
            messages.items
          ))
        }

        dispatch(listenMessages(conv, conv.sid))
      })
      .catch((err) => {
        dispatch(actionsNotifications.addErrorMsg(JSON.stringify(err)))
      })
  }
}

export const showNotification =
  (result: ResultCompareContactsType | ResultCompareInstanceCallType | 'declinedCall', contacts?: ContactsListType): ThunkType =>
    async (dispatch, getState) => {
      const { profile } = getState().profile

      if (profile) {
        if (result === 'declinedCall') {
          const { room } = getState().videoChat
          if (room) {
            room.disconnect()
            dispatch(actionsVideoChat.setRoom(null))
          }
          return
        }
        if (determineNotificationContactsOrCall(result)) {
          // const {
          //   room, made, token, uid
          // } = result
          //
          // const {
          //   displayName, first_name, last_name, name
          // } = profile.mutuals[uid]
          //
          // const userName = name || displayName || `${first_name} ${last_name}`
          //
          // const payload = {
          //   data: {
          //     made,
          //     room,
          //     slots: 'now',
          //     token,
          //     uid
          //   },
          //   notification: {
          //     body: userName,
          //     title: ''
          //   }
          // }
          // dispatch(actionsNotifications.addIncomingCall(payload))
          return
        }

        if (result.action === 'addUserInMyContacts') {
          if (contacts && (profile.mutuals[result.contact.uid] || profile.liked[result.contact.uid])) return

          switch (contacts) {
            case 'mutuals': {
              dispatch(actionsNotifications.addContactsEventMsg(
                result.contact,
                'approved your request and would like to talk.',
                uuidv4()
              ))
              break
            }
            case 'liked': {
              const msg = profile.activeRole === 'investor' ? 'New prospective investor!' : 'New investment opportunity!'
              dispatch(actionsNotifications.addContactsEventMsg(
                result.contact,
                msg,
                uuidv4()
              ))
              break
            }
            default: break
          }
        }
      }
    }

export const updateMyProfile = (
  value: { [key: string]: any },
  onFinish?: () => void
): ThunkType => async (dispatch, getState) => {
  const { profile } = getState().profile
  if (profile) {
    let status
    let updatedProfile = { ...profile }

    if ('tags' in value) {
      status = await profileAPI.updateMyProfile(value)
    } else if ('settings' in value) {
      status = await profileAPI.updateSettings({ settings: value.settings })
      await profileAPI.updateActiveRole(profile.activeRole, { hidden: value.hidden })
      value.hidden.forEach((role: RoleType) => {
        if (updatedProfile[role]) updatedProfile[role].hidden = true
      })
    } else {
      status = await profileAPI.updateActiveRole(profile.activeRole, value)
    }

    if (status === apiCodes.success) {
      if ('tags' in value) {
        updatedProfile = {
          ...updatedProfile,
          ...value
        }
      } else if ('settings' in value) {
        updatedProfile.settings = value.settings
      } else {
        updatedProfile[profile.activeRole] = {
          ...updatedProfile[profile.activeRole],
          ...value
        }
      }

      dispatch(actions.setMyProfile(updatedProfile))
    }

    if (onFinish) onFinish()
  }
}

export const uploadVideo = (
  file: File,
  title: string,
  setIsOpenModal: (isOpenModal: boolean) => void,
  setIsLoadingButton: (inLoadingButton: 'onSaveButton' | null) => void
): ThunkType => async (dispatch, getState, getFirebase) => {
  dispatch(actions.setProgressLoadingFile(0.1))

  const { upload_url, ref } = await profileAPI.uploadVideo(title)

  const upload = UpChunk.createUpload({
    endpoint: upload_url,
    file,
    chunkSize: 5120
  })

  setIsLoadingButton(null)

  upload.on('error', async (err) => {
    console.log('💥 🙀', err.detail)
    await profileAPI.deleteVideo(title)
    setIsOpenModal(false)
    dispatch(actionsNotifications.addErrorMsg('Failed to upload the video'))
  })

  upload.on('offline', () => {
    dispatch(actionsNotifications.addAnyMsg({ msg: 'You are now offline. Your video will be uploaded once you come online', uid: uuidv4() }))
    setIsOpenModal(false)
  })

  upload.on('progress', (progress) => {
    const { progressLoadingFile } = getState().profile
    const progressDetail = progressLoadingFile === 100 ? null : progress.detail
    dispatch(actions.setProgressLoadingFile(progressDetail))
    console.log('Uploaded', progress.detail, 'percent of this file.')
  })

  upload.on('success', async () => {
    console.log("Wrap it up, we're done here. 👋")

    const { firebase: { auth: { uid } }, profile: { profile } } = getState()

    if (profile) {
      const updatedProfile = {
        ...profile,
        [profile.activeRole]: {
          ...profile[profile.activeRole],
          videos: {
            ...profile[profile.activeRole].videos,
            _uploading_: [
              ...profile[profile.activeRole].videos._uploading_,
              title
            ]
          }
        }
      }
      dispatch(actions.setMyProfile(updatedProfile))
    }

    setIsOpenModal(false)

    const unSubscribe = await getFirebase().firestore().doc(ref).onSnapshot(async (doc) => {
      const video = doc.data() as onSnapshotVideoType

      if (video.status === 'ready') {
        const { profile } = getState().profile

        if (profile) {
          const updatedProfile = {
            ...profile,
            [profile.activeRole]: {
              ...profile[profile.activeRole],
              videos: {
                ...profile[profile.activeRole].videos,
                _uploading_: profile[profile.activeRole].videos._uploading_.filter((video) => video !== title),
                _order_: [
                  title,
                  ...profile[profile.activeRole].videos._order_
                ],
                [title]: {
                  width: video.max_width,
                  height: video.max_height,
                  playbackID: video.playbackID,
                  assetID: video.asset_id,
                  created_at: video.created
                }
              }
            }
          }

          dispatch(actions.setMyProfile(updatedProfile))
        }
        unSubscribe()
      }
    })
  })
}

export const renameVideo = (
  assetID: string,
  title: string,
  newTitle: string,
  setIsOpenModal: (isOpen: boolean) => void,
  setIsLoadingButton: (isLoadingButton: 'onSaveButton' | 'onDeleteButton' | null) => void
): ThunkType => async (dispatch, getState) => {
  const status = await profileAPI.renameVideo(title, newTitle)

  if (status === apiCodes.success) {
    const { profile } = getState().profile

    if (profile) {
      const updatedVideosOrder = [...profile[profile.activeRole].videos._order_]
      const updatedVideoOrderIndex = profile[profile.activeRole].videos._order_.findIndex((video) => video === title)
      updatedVideosOrder[updatedVideoOrderIndex] = newTitle

      const updatedProfile = {
        ...profile,
        [profile.activeRole]: {
          ...profile[profile.activeRole],
          videos: {
            ...profile[profile.activeRole].videos,
            _order_: updatedVideosOrder,
            [newTitle]: { ...profile[profile.activeRole].videos[title] }
          }
        }
      }

      delete updatedProfile[updatedProfile.activeRole].videos[title]

      dispatch(actions.setMyProfile(updatedProfile))
    }
  }
  setIsLoadingButton(null)
  setIsOpenModal(false)
}

export const deleteVideo = (
  title: string,
  setIsOpenModal: (isOpen: boolean) => void,
  setIsLoadingButton: (isLoadingButton: 'onSaveButton' | 'onDeleteButton' | null) => void
): ThunkType => async (dispatch, getState) => {
  const status = await profileAPI.deleteVideo(title)

  if (status === apiCodes.success) {
    const { profile } = getState().profile

    if (profile) {
      const updatedVideosOrder = [...profile[profile.activeRole].videos._order_]
      const updatedVideoOrderIndex = updatedVideosOrder.findIndex((titleVideo) => titleVideo === title)

      updatedVideosOrder.splice(updatedVideoOrderIndex, 1)

      const updatedProfile = {
        ...profile,
        [profile.activeRole]: {
          ...profile[profile.activeRole],
          videos: {
            ...profile[profile.activeRole].videos,
            _order_: profile[profile.activeRole].videos._order_.filter((video) => video !== title)
          }
        }
      }

      delete updatedProfile[updatedProfile.activeRole].videos[title]

      dispatch(actions.setMyProfile(updatedProfile))
    }
  }
  setIsLoadingButton(null)
  setIsOpenModal(false)
}

const togglePreloader = (
  contacts: 'mutuals' | 'likes' | 'liked',
  uid: string,
  action: string
): ThunkType => (dispatch, getState) => {
  const { profile } = getState().profile

  if (profile) {
    const user = profile[contacts][uid]

    const updatedUser = { ...user }
    let loading

    if (user.loading) {
      if (user.loading?.some((el) => el === action)) {
        loading = user.loading.filter((el) => el !== action)
      } else {
        loading = [...user.loading, action]
      }
    } else {
      loading = [action]
    }

    updatedUser.loading = loading

    dispatch(actions.updateUserInMyContacts(updatedUser, contacts))
  }
}

export const callNow = (uid: string): ThunkType => async (dispatch, getState) => {
  const { profile } = getState().profile

  if (profile) {
    dispatch(actionsVideoChat.setViewEndCallAll(true))
    dispatch(actionsVideoChat.setIsOwnerCall())

    const contacts = 'mutuals'

    dispatch(togglePreloader(contacts, uid, 'callNow'))

    const response: ResponseCallNowType = await usersAPI.callNow(uid, profile.currentDeviceId).catch((err) => {
      dispatch(actionsNotifications.addErrorMsg(JSON.stringify(err)))
    })

    if (response) {
      const { room, token } = response
      dispatch(connectToVideoRoom(room, token))
    }

    dispatch(togglePreloader(contacts, uid, 'callNow'))
  }
}

export const declineCall = (uid: string): ThunkType => async (dispatch, getState) => {
  const { room } = getState().videoChat

  dispatch(actions.updateMySlots('del', 'now'))

  const status = await usersAPI.callDecline(uid)

  if (status === apiCodes.success) {
    room?.disconnect()
    dispatch(actionsVideoChat.reset())
  }
}

export const createNewRole = (
  role: 'investor' | 'founder',
  jobInfo: {
    job: JobType,
    stages: (number | string)[],
    industries: (number | string)[]
  }
): ThunkType => async (dispatch, getState) => {
  const status = await profileAPI.updateActiveRole(role, jobInfo)

  if (status === apiCodes.success) {
    const { profile } = getState().profile

    if (profile) {
      const updatedProfile = {
        ...profile,
        activeRole: role,
        [role]: {
          ...jobInfo,
          videos: {
            _order_: [],
            _uploading_: []
          },
          docs: {
            _order_: []
          }
        }
      }

      dispatch(actions.setMyProfile(updatedProfile))
    }
  }
}

export const switchRole = (): ThunkType => async (dispatch, getState) => {
  const { profile } = getState().profile

  if (profile) {
    const activeRole = profile.activeRole === 'founder' ? 'investor' : 'founder'

    const status = await profileAPI.updateActiveRole(activeRole)

    if (status === apiCodes.success) {
      await dispatch(initSurf())

      const updatedProfile = {
        ...profile,
        activeRole
      }

      dispatch(actions.setMyProfile(updatedProfile))
    }
  }
}

export const openChat = (uid: string, redirect: () => void): ThunkType => async (dispatch, getState) => {
  const contacts = 'mutuals'

  dispatch(togglePreloader(contacts, uid, 'openChat'))

  const { profile } = getState().profile

  if (profile) {
    const users = profile[contacts]
    const { chat } = users[uid]
    if (chat) {
      dispatch(actionsConversations.setOpenedChat(chat))
      redirect()
    } else {
      const { client, chats } = getState().conversations

      activeActions.push(`${uid}-chat`)

      const createdChat: { chat_sid: string, status: string } = await usersAPI
        .createChat(uid)
        .catch((err) => {
          console.log(err)
          dispatch(actionsNotifications.addErrorMsg(JSON.stringify(err)))
        })

      dispatch(actions.addChatInMutual(uid, createdChat.chat_sid))

      const conversation = await client?.getConversationBySid(createdChat.chat_sid)

      if (conversation) {
        const {
          name, displayName, first_name, last_name, photoURL, photoBase64
        } = users[uid]

        const updatedChats: ChatType = {
          ...chats,
          [createdChat.chat_sid]: {
            chat: createdChat.chat_sid,
            name: name || displayName || `${first_name} ${last_name}`,
            photoUrl: photoURL,
            photoBase64,
            messages: [],
            missedMessages: 0,
            conversation
          }
        }

        dispatch(actionsConversations.setChats(updatedChats))

        const updatedUser = {
          ...users[uid],
          chat: createdChat.chat_sid
        }

        dispatch(listenMessages(conversation, conversation.sid))

        dispatch(actions.updateUserInMyContacts(updatedUser, contacts))

        dispatch(actionsConversations.setOpenedChat(createdChat.chat_sid))

        redirect()
      }
    }
  }

  dispatch(togglePreloader(contacts, uid, 'openChat'))
}

export const shareLinkMyProfile = (): ThunkType => async (dispatch, getState) => {
  const { profile } = getState().profile

  if (!profile) return

  const { uid } = profile

  if (uid) {
    dispatch(actions.toggleLoader('shareMyProfile'))

    dispatch(addToClipboardPublicLinkProfile(
      uid,
      () => dispatch(actions.toggleLoader('shareMyProfile'))
    ))
  }
}

export const updateTimeSlots = (
  action: 'add' | 'del' | 'disable' | 'enable',
  date: string
): ThunkType => async (dispatch) => {
  const timeZone = moment(new Date()).utcOffset()
  const formattedDate = `${moment(date).subtract(timeZone, 'minutes').format('YYYY-MM-DDTHH:mm:00')}Z`

  const result = await profileAPI.updateMyTimeSlots({ [action]: [formattedDate] }).catch((err) => {
    dispatch(actionsNotifications.addErrorMsg(err.toString()))
  })

  if (result) {
    if (!result.errors.length) {
      let timeSlot: string | SlotsType = formattedDate
      if (action === 'add') {
        timeSlot = {
          [formattedDate]: { status: 'free', duration: 15 }
        }
      }
      dispatch(actions.updateMySlots(action, timeSlot))
    }
  }
}

export const connectToCall = (date: string, uid: string): ThunkType => async (dispatch, getState) => {
  const { profile } = getState().profile

  if (profile) {
    const companion = profile.mutuals[uid]
    const companionName = companion.name || companion.displayName || `${companion.first_name} ${companion.last_name}`

    const timeZone = moment(new Date()).utcOffset()
    const formattedDate = `${moment(date).subtract(timeZone, 'minutes').format('YYYY-MM-DDTHH:mm:00')}Z`

    const res = await usersAPI.connectToCall(formattedDate, uid).catch((err) => {
      dispatch(actionsNotifications.addErrorMsg(err.toString()))
    })

    if (res?.data.status === 'scheduled') {
      const newSlot = {
        status: 'scheduled',
        duration: 15,
        uid
      }
      const attributes = { ...res.data, scheduledAt: date, duration: res.data.duration * 60 }
      if (companion.chat) {
        dispatch(sendMessage('Meeting', companion.chat, attributes))
      } else {
        const { chat_sid: chatSid }: { chat_sid: string, status: string } = await usersAPI
          .createChat(uid)
          .catch((err) => {
            console.log(err)
            dispatch(actionsNotifications.addErrorMsg(JSON.stringify(err)))
          })
        dispatch(sendMessage('Meeting', chatSid, attributes))
      }
      dispatch(actions.updateMySlots('add', { [formattedDate]: newSlot }))
      dispatch(actionsNotifications.addAnyMsg({
        msg: `You have scheduled a meeting with ${companionName}`,
        uid: uuidv4()
      }))
    }
  }
}

export const sendCallSummary = (roomId: string) : ThunkType => async (dispatch, getState) => {
  const contacts = 'mutuals'
  const { profile } = getState().profile
  const callsHistory = await usersAPI.getCallHistory()
  const room = callsHistory.rooms[roomId]
  const eventIndexes = Object.keys(room).filter((index) => isNumber(index))
  const callStartTime = room[eventIndexes[0]].Timestamp
  const callEndTime = room[eventIndexes[eventIndexes.length - 1]].Timestamp
  const callDuration = moment(callEndTime).diff(callStartTime, 'seconds')
  const remoteUserUid = room.users.find((id: string) => id !== profile?.uid)
  if (profile) {
    const users = profile[contacts]
    const { chat } = users[remoteUserUid]
    if (chat) {
      dispatch(actionsConversations.setOpenedChat(chat))
      dispatch(sendMessage('call', chat, { duration: callDuration }))
    }
  }
}

export const uploadDoc = (
  title: string,
  file: File,
  onFinish: () => void
): ThunkType => (dispatch, getState) => {
  const { profile: { profile } } = getState()
  profileAPI
    .uploadDoc(title, file)
    .then(({ docUrl }) => {
      if (profile) {
        const { docs } = profile[profile.activeRole]
        const order = docs._order_
        const updatedProfile = {
          ...profile,
          [profile.activeRole]: {
            ...profile[profile.activeRole],
            docs: {
              ...docs,
              [file.name]: docUrl,
              _order_: docs[file.name] ? order : [...order, file.name]
            }
          }
        }
        dispatch(actions.setMyProfile(updatedProfile))
      }
    })
    .catch(() => dispatch(actionsNotifications.addErrorMsg("We are sorry we couldn't upload your file. Please make sure it is not corrupted.")))
    .finally(onFinish)
}

export const deleteDoc = (
  title: string,
  setIsOpenModal: (isOpen: boolean) => void,
  setLoadingButton: (loadingButton: 'onSaveButton' | 'onDeleteButton' | null) => void
): ThunkType => async (dispatch, getState) => {
  const status = await profileAPI.deleteDoc(title)

  if (status === apiCodes.success) {
    const { profile } = getState().profile

    if (profile) {
      const updatedProfile = {
        ...profile,
        [profile.activeRole]: {
          ...profile[profile.activeRole],
          docs: {
            ...profile[profile.activeRole].docs,
            _order_: profile[profile.activeRole].docs._order_.filter((doc) => doc !== title)
          }
        }
      }

      delete updatedProfile[updatedProfile.activeRole].docs[title]

      dispatch(actions.setMyProfile(updatedProfile))
    }
  }
  setLoadingButton(null)
  setIsOpenModal(false)
}

export const renameDoc = (
  title: string,
  newTitle: string,
  setIsOpenModal: (isOpen: boolean) => void,
  setLoadingButton: (loadingButton: 'onSaveButton' | 'onDeleteButton' | null) => void
): ThunkType => async (dispatch, getState) => {
  const status = await profileAPI.renameDoc(title, newTitle)

  if (status === apiCodes.success) {
    const { profile } = getState().profile

    if (profile) {
      const updatedDocsOrder = [...profile[profile.activeRole].docs._order_]
      const updatedDocsOrderIndex = profile[profile.activeRole].docs._order_.findIndex((doc) => doc === title)
      updatedDocsOrder[updatedDocsOrderIndex] = newTitle

      const updatedProfile = {
        ...profile,
        [profile.activeRole]: {
          ...profile[profile.activeRole],
          docs: {
            ...profile[profile.activeRole].docs,
            _order_: updatedDocsOrder,
            [newTitle]: profile[profile.activeRole].docs[title]
          }
        }
      }

      delete updatedProfile[updatedProfile.activeRole].docs[title]

      dispatch(actions.setMyProfile(updatedProfile))
    }
  }
  setLoadingButton(null)
  setIsOpenModal(false)
}
