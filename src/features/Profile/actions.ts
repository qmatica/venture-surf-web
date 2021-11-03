import { connect, ConnectOptions } from 'twilio-video'
import { v4 as uuidv4 } from 'uuid'
import { profileAPI, usersAPI } from 'api'
import { apiCodes } from 'common/types'
import { actions as actionsVideoChat } from 'features/VideoChat/actions'
import { actions as actionsConversations } from 'features/Conversations/actions'
import {
  actions as actionsNotifications
} from 'features/Notifications/actions'
import * as UpChunk from '@mux/upchunk'
import { init as initSurf } from 'features/Surf/actions'
import { UserType } from 'features/User/types'
import { getToken, onMessage } from 'firebase/messaging'
import { messaging } from 'store/store'
import { IncomingCallType } from 'features/Notifications/types'
import {
  JobType,
  ResponseCallNowType,
  ThunkType,
  onSnapshotVideoType,
  ProfileType,
  ResultCompareContactsType,
  ContactsListType,
  ResultCompareInstanceCallType
} from './types'
import { ChatType } from '../Conversations/types'
import { compareContacts, compareSlots } from './utils'
import { determineNotificationContactsOrCall } from '../../common/typeGuards'

export const actions = {
  setMyProfile: (profile: any) => ({ type: 'PROFILE__SET_MY_PROFILE', profile } as const),
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
  )
}

export const init = (): ThunkType => async (dispatch, getState) => {
  let deviceId = localStorage.getItem('deviceId')

  if (!deviceId) {
    deviceId = uuidv4()
    localStorage.setItem('deviceId', deviceId)
  }

  // const fcm_token = await getToken(messaging).catch((err) => {
  //   console.log('An error occurred while retrieving token. ', err)
  // })

  const fcm_token = 'null'

  if (fcm_token) {
    dispatch(actions.setIsActiveFcm(true))
  }

  const device = {
    id: deviceId,
    os: window.navigator.appVersion,
    fcm_token,
    voip_token: '12428345723486-34639456-4563-4956',
    bundle: 'opentek.us.VentureSwipe'
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

  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload)
    dispatch(checkIncomingCall(payload))
  })

  dispatch(listenUpdateMyProfile())
}

const checkIncomingCall = (payload: IncomingCallType | any): ThunkType => async (dispatch, getState) => {
  if (payload?.notification?.title === 'Incoming call from') {
    if (payload.data.slots.includes('now')) {
      dispatch(actionsNotifications.addIncomingCall(payload))
    }
  }
}

const listenUpdateMyProfile = (): ThunkType => async (dispatch, getState, getFirebase) => {
  const { auth } = getState().firebase

  getFirebase().firestore().doc(`profiles/${auth.uid}`).onSnapshot(async (doc) => {
    const { profile } = getState().profile
    const newProfile = doc.data() as ProfileType

    console.log('My profile updated: ', newProfile)

    if (profile) {
      const contactsList = ['mutuals', 'likes', 'liked'] as const

      contactsList.forEach((contacts) => {
        const result = compareContacts(profile[contacts], newProfile[contacts])
        if (result) {
          if (!profile.isActiveFcm) {
            dispatch(showNotification(result, contacts))
          }
          dispatch(actions[result.action](result.contact, contacts))
        }
      })

      const result = compareSlots(profile.slots, newProfile.slots)
      if (result) {
        dispatch(showNotification(result))
      }
    }
  })
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
            dispatch(actionsVideoChat.setRoom(null, null))
          }
          return
        }
        if (determineNotificationContactsOrCall(result)) {
          const {
            room, made, token, uid
          } = result

          const {
            displayName, first_name, last_name, name
          } = profile.mutuals[uid]

          const userName = name || displayName || `${first_name} ${last_name}`

          const payload = {
            data: {
              made,
              room,
              slots: 'now',
              token,
              uid
            },
            notification: {
              body: userName,
              title: ''
            }
          }
          dispatch(actionsNotifications.addIncomingCall(payload))
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

export const updateMyProfile = (value: { [key: string]: any }): ThunkType => async (dispatch, getState) => {
  const { profile } = getState().profile
  if (profile) {
    let status

    if ('tags' in value) {
      status = await profileAPI.updateMyProfile(value)
    } else {
      status = await profileAPI.updateActiveRole(profile.activeRole, value)
    }

    if (status === apiCodes.success) {
      let updatedProfile

      if ('tags' in value) {
        updatedProfile = {
          ...profile,
          ...value
        }
      } else {
        updatedProfile = {
          ...profile,
          [profile.activeRole]: {
            ...profile[profile.activeRole],
            ...value
          }
        }
      }

      dispatch(actions.setMyProfile(updatedProfile))
    }
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

  upload.on('error', (err) => {
    console.error('💥 🙀', err.detail)
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
    const contacts = 'mutuals'

    dispatch(togglePreloader(contacts, uid, 'callNow'))

    const response: ResponseCallNowType = await usersAPI.callNow(uid, profile.currentDeviceId).catch((err) => {
      dispatch(actionsNotifications.addErrorMsg(JSON.stringify(err)))
    })

    if (response) {
      const room = await connect(response.token, { room: response.room } as ConnectOptions).catch((err) => {
        dispatch(actionsNotifications.addErrorMsg(JSON.stringify(err)))
      })

      if (room) dispatch(actionsVideoChat.setRoom(room, uid))
    }

    dispatch(togglePreloader(contacts, uid, 'callNow'))
  }
}

export const declineCall = (uid: string): ThunkType => async (dispatch, getState) => {
  const { room } = getState().videoChat

  const status = await usersAPI.callDecline(uid)

  if (status === apiCodes.success) {
    room?.disconnect()
    dispatch(actionsVideoChat.setRoom(null, null))
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

      const createdChat: { chat_sid: string, status: string } = await usersAPI
        .createChat(uid)
        .catch((err) => {
          console.log(err)
          dispatch(actionsNotifications.addErrorMsg(JSON.stringify(err)))
        })

      const conversation = await client?.getConversationBySid(createdChat.chat_sid)

      const {
        name, displayName, first_name, last_name, photoURL
      } = users[uid]

      const updatedChats: ChatType = {
        ...chats,
        [createdChat.chat_sid]: {
          chat: createdChat.chat_sid,
          name: name || displayName || `${first_name} ${last_name}`,
          photoUrl: photoURL,
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

      dispatch(actions.updateUserInMyContacts(updatedUser, contacts))

      dispatch(actionsConversations.setOpenedChat(createdChat.chat_sid))

      redirect()
    }
  }

  dispatch(togglePreloader(contacts, uid, 'openChat'))
}

export const shareLinkMyProfile = (): ThunkType => async (dispatch, getState) => {
  const { profile } = getState().profile

  if (profile) {
    const { uid } = profile

    if (uid) {
      dispatch(actions.toggleLoader('shareMyProfile'))

      const { token } = await usersAPI.createPublicToken(uid).catch((err) => {
        dispatch(actionsNotifications.addErrorMsg(JSON.stringify(err)))
      })
      if (token) {
        const baseURL = window.location.origin
        const publicLinkProfile = `${baseURL}/profile/${profile.uid}?publicToken=${token}`

        navigator.clipboard.writeText(publicLinkProfile).then(() => {
          console.log('Public link profile copied: ', publicLinkProfile)

          dispatch(actionsNotifications.addAnyMsg({
            msg: 'Public link for my profile copied!',
            uid: uuidv4()
          }))

          dispatch(actions.toggleLoader('shareMyProfile'))
        }).catch((err) => {
          dispatch(actionsNotifications.addErrorMsg(JSON.stringify(err)))
          dispatch(actions.toggleLoader('shareMyProfile'))
        })
      }
    }
  }
}
