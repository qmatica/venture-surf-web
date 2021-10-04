import { connect, ConnectOptions } from 'twilio-video'
import { v4 as uuidv4 } from 'uuid'
import { profileAPI, usersAPI } from 'api'
import { apiCodes } from 'common/types'
import { actions as actionsVideoChat } from 'features/VideoChat/actions'
import { actions as actionsConversations } from 'features/Conversations/actions'
import * as UpChunk from '@mux/upchunk'
import { EnumActionsUser } from 'features/User/constants'
import { addMessage } from 'features/Notifications/actions'
import { UsersType } from 'features/User/types'
import {
  CalendarMinIcon, LikeIcon, MailIconMin, PeopleIcon, PhoneCallIcon, WithdrawLikeIcon
} from 'common/icons'
import { Message } from '@twilio/conversations/lib/message'
import {
  JobType, ResponseCallNowType, ThunkType, VideoType
} from './types'
import { ChatType } from '../Conversations/types'

export const actions = {
  setMyProfile: (profile: any) => ({ type: 'PROFILE__SET_MY_PROFILE', profile } as const),
  setProgressLoadingFile: (progressLoadingFile: number | null) => (
      { type: 'PROFILE__SET_PROGRESS_FILE', progressLoadingFile } as const
  ),
  updateMyContacts: (updatedUsers: any) => ({ type: 'PROFILE__UPDATE_MY_CONTACTS', updatedUsers } as const)
}

export const init = (): ThunkType => async (dispatch, getState, getFirebase) => {
  let deviceId = localStorage.getItem('deviceId')

  if (!deviceId) {
    deviceId = uuidv4()
    localStorage.setItem('deviceId', deviceId)
  }

  const device = {
    id: deviceId,
    os: window.navigator.appVersion,
    fcm_token: 'fcm_token_web',
    voip_token: '12428345723486-34639456-4563-4956',
    bundle: 'opentek.us.VentureSwipe'
  }

  const response = await Promise.all([profileAPI.afterLogin(device), profileAPI.getVideos()])

  const profile = response[0]
  const videos = response[1]

  const mutuals: UsersType = {}
  const likes: UsersType = {}
  const liked: UsersType = {}

  if (profile.mutuals) {
    Object.values(profile.mutuals as UsersType).forEach((user) => {
      mutuals[user.uid] = {
        ...user,
        actions: {
          callNow: {
            onClick() {
              dispatch(callNow(user.uid))
            },
            title: 'Call now',
            isActive: true,
            isLoading: false,
            type: EnumActionsUser.static,
            icon: PhoneCallIcon
          },
          openChat: {
            onClick: (redirect: () => void) => {
              dispatch(openChat(user.uid, redirect))
            },
            title: 'Open chat',
            isActive: true,
            isLoading: false,
            type: EnumActionsUser.static,
            icon: MailIconMin
          },
          arrangeAMeeting: {
            onClick() {
              console.log('Arrange a meeting')
            },
            title: 'Arrange a meeting',
            isActive: true,
            isLoading: false,
            type: EnumActionsUser.static,
            icon: CalendarMinIcon
          },
          recommended: {
            onClick() {
              console.log('Recommended')
            },
            title: 'Recommended',
            isActive: true,
            isLoading: false,
            type: EnumActionsUser.static,
            icon: PeopleIcon
          }
        }
      }
    })
  }

  if (response[0].likes) {
    Object.values(response[0].likes as UsersType).forEach((user) => {
      likes[user.uid] = {
        ...user,
        actions: {
          like: {
            onClick() {
              dispatch(like(user.uid))
            },
            title: 'Like',
            isActive: false,
            isLoading: false,
            type: EnumActionsUser.dynamic,
            icon: LikeIcon
          },
          withdrawLike: {
            onClick() {
              dispatch(withdrawLike(user.uid))
            },
            title: 'Withdraw like',
            isActive: true,
            isLoading: false,
            type: EnumActionsUser.dynamic,
            icon: WithdrawLikeIcon
          }
        }
      }
    })
  }

  if (response[0].liked) {
    Object.values(response[0].liked as UsersType).forEach((user) => {
      liked[user.uid] = {
        ...user,
        actions: {
          accept: {
            onClick() {
              dispatch(accept(user.uid))
            },
            title: 'Accept',
            isActive: true,
            isLoading: false,
            type: EnumActionsUser.dynamic
          },
          ignore: {
            onClick() {
              dispatch(ignore(user.uid))
            },
            title: 'Ignore',
            isActive: true,
            isLoading: false,
            type: EnumActionsUser.dynamic
          },
          cancel: {
            onClick() {
              console.log('Cancel')
            },
            title: 'Cancel',
            isActive: false,
            isLoading: false,
            type: EnumActionsUser.dynamic
          }
        }
      }
    })
  }

  const updatedProfile = {
    ...response[0],
    mutuals,
    likes,
    liked,
    videos
  }
  dispatch(actions.setMyProfile(updatedProfile))

  dispatch(subscribeOnListenIncomingCalls())
}

const subscribeOnListenIncomingCalls = (): ThunkType => async (dispatch, getState, getFirebase) => {
  const { auth } = getState().firebase

  await getFirebase().firestore()
    .doc(`profiles/${auth.uid}`)
    .onSnapshot(async (doc) => {
      console.log('subscribeOnListenIncomingCalls: updated profile')

      const myProfile: any = doc.data()
      console.log(myProfile)

      if (myProfile) {
        const { slots } = myProfile
        if (slots?.now) {
          console.log(slots.now)

          if (slots.now.status !== 'waiting') {
            const { profile } = getState().profile
            const remoteUser = profile?.mutuals[slots.now.uid]

            if (remoteUser) {
              dispatch(actionsVideoChat.setNotification({
                type: 'incomingСall',
                request: slots.now.request,
                user: {
                  uid: remoteUser.uid,
                  photoURL: remoteUser.photoURL,
                  displayName: remoteUser.displayName || remoteUser.name || `${remoteUser.first_name} ${remoteUser.last_name}`
                },
                actions: {
                  accept() {
                    connect(slots.now.twilio.token, { room: slots.now.twilio.room } as ConnectOptions).then((room) => {
                      dispatch(actionsVideoChat.setRoom(room, remoteUser.uid))
                      dispatch(actionsVideoChat.clearNotification(slots.now.request))
                    }).catch((err) => {
                      dispatch(addMessage({
                        title: 'Error connect to video chat',
                        value: err,
                        type: 'error'
                      }))
                    })
                  },
                  async decline() {
                    dispatch(actionsVideoChat.clearNotification(slots.now.request))
                    await dispatch(declineCall(remoteUser.uid))
                  }
                }
              }))
            }
          }
        }
      }
    })
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
      const profileVideos = profile.videos ? { ...profile.videos } : {}
      const updatedProfile = {
        ...profile,
        videos: {
          ...profileVideos,
          [`${profile.activeRole}.${title}`]: {
            aspect_ratio: '',
            asset_id: '',
            created: Date.now(),
            duration_secs: 0,
            encoding_quality: '',
            encoding_url: '',
            id: '',
            max_height: 0,
            max_width: 0,
            playbackID: '',
            role: profile.activeRole,
            status: 'uploading',
            thumb_url: '',
            title,
            uid,
            upload_id: '',
            upload_url: ''
          }
        }
      }
      dispatch(actions.setMyProfile(updatedProfile))
    }

    setIsOpenModal(false)

    const unSubscribe = await getFirebase().firestore().doc(ref).onSnapshot(async (doc) => {
      const video = doc.data() as VideoType

      if (video.status === 'ready') {
        const { profile } = getState().profile

        if (profile) {
          const updatedVideos = {
            ...profile.videos,
            [`${profile.activeRole}.${title}`]: video
          }

          const updatedVideosOrder = [...profile[profile.activeRole].videos._order_, title]

          const updatedProfile = {
            ...profile,
            videos: updatedVideos,
            [profile.activeRole]: {
              ...profile[profile.activeRole],
              videos: {
                _order_: updatedVideosOrder
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
  asset_id: string,
  title: string,
  newTitle: string,
  setIsOpenModal: (isOpen: boolean) => void,
  setIsLoadingButton: (isLoadingButton: 'onSaveButton' | 'onDeleteButton' | null) => void
): ThunkType => async (dispatch, getState) => {
  const status = await profileAPI.renameVideo(title, newTitle)

  if (status === apiCodes.success) {
    const { profile } = getState().profile

    if (profile) {
      const videos = Object.entries(profile.videos)
      const updatedVideo = videos.find((([key, video]) => video.asset_id === asset_id))
      const updatedVideosOrder = [...profile[profile.activeRole].videos._order_]
      const updatedVideoOrderIndex = updatedVideosOrder.findIndex((titleVideo) => titleVideo === title)

      updatedVideosOrder[updatedVideoOrderIndex] = newTitle

      if (updatedVideo) {
        const updatedVideos = {
          ...profile.videos,
          [updatedVideo[0]]: {
            ...updatedVideo[1],
            title: newTitle
          }
        }

        const updatedProfile = {
          ...profile,
          videos: updatedVideos,
          [profile.activeRole]: {
            ...profile[profile.activeRole],
            videos: {
              _order_: updatedVideosOrder
            }
          }
        }

        dispatch(actions.setMyProfile(updatedProfile))
      }
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
      const videos = Object.entries(profile.videos)

      let updatedVideos = {}

      videos.forEach((([key, video]) => {
        if (video.title !== title) {
          updatedVideos = {
            [key]: { ...video }
          }
        }
      }))

      const updatedVideosOrder = [...profile[profile.activeRole].videos._order_]
      const updatedVideoOrderIndex = updatedVideosOrder.findIndex((titleVideo) => titleVideo === title)

      updatedVideosOrder.splice(updatedVideoOrderIndex, 1)

      const updatedProfile = {
        ...profile,
        videos: updatedVideos,
        [profile.activeRole]: {
          ...profile[profile.activeRole],
          videos: {
            _order_: updatedVideosOrder
          }
        }
      }

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
    const users = profile[contacts]

    const updatedUsers = {
      ...users,
      [uid]: {
        ...users[uid],
        actions: {
          ...users[uid].actions,
          [action]: {
            ...users[uid].actions[action],
            isLoading: !users[uid].actions[action].isLoading
          }
        }
      }
    }

    dispatch(actions.updateMyContacts({ [contacts]: updatedUsers }))
  }
}

const toggleActions = (
  contacts: 'mutuals' | 'likes' | 'liked',
  uid: string,
  toggleActions: string[]
): ThunkType => (dispatch, getState) => {
  const { profile } = getState().profile

  if (profile) {
    const users = profile[contacts]

    const updatedUsers = toggleActions.reduce((updatedUsers, nextAction) => ({
      ...updatedUsers,
      [uid]: {
        ...updatedUsers[uid],
        actions: {
          ...updatedUsers[uid].actions,
          [nextAction]: {
            ...updatedUsers[uid].actions[nextAction],
            isActive: !updatedUsers[uid].actions[nextAction].isActive
          }
        }
      }
    }), users)

    dispatch(actions.updateMyContacts({ [contacts]: updatedUsers }))
  }
}

const like = (uid: string): ThunkType => async (dispatch) => {
  const contacts = 'likes'

  dispatch(togglePreloader(contacts, uid, 'like'))

  const status = await usersAPI.like(uid).catch((err) => {
    dispatch(addMessage({
      title: 'Error',
      value: err.error,
      type: 'error'
    }))
  })

  if (status === apiCodes.success) {
    dispatch(toggleActions(contacts, uid, ['like', 'withdrawLike']))
  }

  dispatch(togglePreloader(contacts, uid, 'like'))
}

const withdrawLike = (uid: string): ThunkType => async (dispatch) => {
  const contacts = 'likes'

  dispatch(togglePreloader(contacts, uid, 'withdrawLike'))

  const status = await usersAPI.withdrawLike(uid).catch((err) => {
    dispatch(addMessage({
      title: 'Error',
      value: err.error,
      type: 'error'
    }))
  })

  if (status === apiCodes.success) {
    dispatch(toggleActions(contacts, uid, ['like', 'withdrawLike']))
  }

  dispatch(togglePreloader(contacts, uid, 'withdrawLike'))
}

const accept = (uid: string): ThunkType => async (dispatch) => {
  const contacts = 'liked'

  dispatch(togglePreloader(contacts, uid, 'accept'))

  const status = await usersAPI.like(uid).catch((err) => {
    dispatch(addMessage({
      title: 'Error',
      value: err.error,
      type: 'error'
    }))
  })

  if (status === apiCodes.success) {
    dispatch(toggleActions(contacts, uid, ['accept', 'ignore', 'cancel']))
    dispatch(addUserInMutualsFromReceived(uid))
  }

  dispatch(togglePreloader(contacts, uid, 'accept'))
}

const ignore = (uid: string): ThunkType => async (dispatch) => {
  const contacts = 'liked'

  dispatch(togglePreloader(contacts, uid, 'ignore'))

  const status = await usersAPI.ignore(uid).catch((err) => {
    dispatch(addMessage({
      title: 'Error',
      value: err.error,
      type: 'error'
    }))
  })

  if (status === apiCodes.success) {
    dispatch(toggleActions(contacts, uid, ['accept', 'ignore', 'cancel']))
  }

  dispatch(togglePreloader(contacts, uid, 'ignore'))
}

export const callNow = (uid: string): ThunkType => async (dispatch) => {
  const contacts = 'mutuals'

  dispatch(togglePreloader(contacts, uid, 'callNow'))

  const response: ResponseCallNowType = await usersAPI.callNow(uid).catch((err) => {
    dispatch(addMessage({
      title: 'Error loading room video',
      value: err,
      type: 'error'
    }))
  })

  if (response) {
    const room = await connect(response.token, { room: response.room } as ConnectOptions).catch((err) => {
      dispatch(addMessage({
        title: 'Error connect to video chat',
        value: err,
        type: 'error'
      }))
    })

    if (room) dispatch(actionsVideoChat.setRoom(room, uid))
  }

  dispatch(togglePreloader(contacts, uid, 'callNow'))
}

export const declineCall = (uid?: string): ThunkType => async (dispatch, getState) => {
  const { room, remoteUserUid } = getState().videoChat

  const status = await usersAPI.callDecline((uid || remoteUserUid) as string)
  if (status === apiCodes.success) {
    room?.disconnect()
    dispatch(actionsVideoChat.setRoom(null, null))
  }
}

export const addUserInLikesFromSurf = (uid: string): ThunkType => (dispatch, getState) => {
  const contacts = 'likes'

  const { profile } = getState().profile
  const { users } = getState().surf

  const userIndex = users.findIndex((user) => user.uid === uid)
  const user = {
    ...users[userIndex],
    actions: {
      like: {
        onClick() {
          dispatch(like(user.uid))
        },
        title: 'Like',
        isActive: false,
        isLoading: false,
        type: EnumActionsUser.dynamic
      },
      withdrawLike: {
        onClick() {
          dispatch(withdrawLike(user.uid))
        },
        title: 'Withdraw like',
        isActive: true,
        isLoading: false,
        type: EnumActionsUser.dynamic
      }
    }
  }

  if (profile) {
    const updatedUsers = {
      ...profile[contacts],
      [uid]: user
    }
    dispatch(actions.updateMyContacts({ [contacts]: updatedUsers }))
  }
}

export const addUserInMutualsFromReceived = (uid: string): ThunkType => (dispatch, getState) => {
  const contacts = 'mutuals'
  const { profile } = getState().profile

  if (profile) {
    const updatedUsers = {
      ...profile[contacts],
      [uid]: {
        ...profile.liked[uid],
        actions: {
          callNow: {
            onClick() {
              dispatch(callNow(uid))
            },
            title: 'Call now',
            isActive: true,
            isLoading: false,
            type: EnumActionsUser.static
          },
          arrangeAMeeting: {
            onClick() {
              console.log('Arrange a meeting')
            },
            title: 'Arrange a meeting',
            isActive: true,
            isLoading: false,
            type: EnumActionsUser.static
          },
          openChat: {
            onClick: (redirect: () => void) => {
              dispatch(openChat(uid, redirect))
            },
            title: 'Open chat',
            isActive: true,
            isLoading: false,
            type: EnumActionsUser.static,
            icon: MailIconMin
          },
          recommended: {
            onClick() {
              console.log('Recommended')
            },
            title: 'Recommended',
            isActive: true,
            isLoading: false,
            type: EnumActionsUser.static
          }
        }
      }
    }

    dispatch(actions.updateMyContacts({ [contacts]: updatedUsers }))
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
  const videos = await profileAPI.getVideos()

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
        },
        videos
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
    const videos = await profileAPI.getVideos()

    if (status === apiCodes.success) {
      const updatedProfile = {
        ...profile,
        activeRole,
        videos
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
    } else {
      const { client, chats } = getState().conversations

      const createdChat: { chat_sid: string, status: string } = await usersAPI
        .createChat(uid)
        .catch((err) => console.log(err))

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

      // const updatedUsers = {
      //   ...users,
      //   [uid]: {
      //     ...users[uid],
      //     chat: createdChat.chat
      //   }
      // }
      //
      // dispatch(actions.updateMyContacts({ [contacts]: updatedUsers }))

      dispatch(actionsConversations.setOpenedChat(createdChat.chat_sid))
    }
  }

  dispatch(togglePreloader(contacts, uid, 'openChat'))
  redirect()
}
