import { connect, ConnectOptions } from 'twilio-video'
import { profileAPI } from 'api'
import { apiCodes } from 'common/types'
import { actions as actionsModal } from 'features/Modal/actions'
import { actions as actionsVideoChat } from 'features/VideoChat/actions'
import * as UpChunk from '@mux/upchunk'
import { actionsUser } from 'features/User/constants'
import { addMessage } from 'features/Notifications/actions'
import { ThunkType, VideoType } from './types'

export const actions = {
  setMyProfile: (profile: any) => ({ type: 'PROFILE__SET_MY_PROFILE', profile } as const),
  setProgressLoadingFile: (progressLoadingFile: number | null) => ({ type: 'PROFILE__SET_PROGRESS_FILE', progressLoadingFile } as const)
}

export const init = (): ThunkType => async (dispatch, getState, getFirebase) => {
  const response = await Promise.all([profileAPI.getProfile(), profileAPI.getVideos()])
  const mutuals: any = {}
  Object.values(response[0].mutuals).forEach((mutual: any) => {
    mutuals[mutual.uid] = {
      ...mutual,
      actions: {
        callNow() {
          dispatch(callNow(mutual.uid))
        },
        arrangeAMeeting() {
          console.log('arrangeAMeeting')
        },
        recommended() {
          console.log('recommended')
        }
      },
      activeActions: [actionsUser.callNow, actionsUser.arrangeAMeeting, actionsUser.recommended],
      loaders: []
    }
  })
  const profile = {
    ...response[0],
    mutuals,
    videos: response[1]
  }
  dispatch(actions.setMyProfile(profile))
}

export const updateMyProfile = (value: { [key: string]: any }, modalName?: string): ThunkType => async (dispatch, getState) => {
  if (modalName) dispatch(actionsModal.toggleLoadingModal(modalName, true))

  const status = await profileAPI.updateMyProfile(value)
  if (status === apiCodes.success) {
    const { profile } = getState().profile
    const updatedProfile = {
      ...profile,
      ...value
    }
    dispatch(actions.setMyProfile(updatedProfile))
    if (modalName) dispatch(actionsModal.closeModal(modalName))
  }

  if (modalName) dispatch(actionsModal.toggleLoadingModal(modalName, false))
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
          ...{
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

type ResponseTypeCallNow = {
  pushes: {
    failed: { device: string }[]
    sent: { device: string }[]
  }
  room: string
  status: string
  token: string
}

export const callNow = (uid: string): ThunkType => async (dispatch, getState) => {
  const { profile } = getState().profile
  if (profile) {
    const updatedProfile = {
      ...profile,
      mutuals: {
        ...profile.mutuals,
        [uid]: {
          ...profile.mutuals[uid],
          loaders: [actionsUser.callNow.action]
        }
      }
    }
    dispatch(actions.setMyProfile(updatedProfile))

    const response: ResponseTypeCallNow = await profileAPI.callNow(uid).catch((err) => {
      dispatch(addMessage({
        title: 'Error loading room video',
        value: err,
        type: 'error'
      }))
    })

    connect(response.token, { room: response.room } as ConnectOptions).then((room) => {
      dispatch(actionsVideoChat.setRoom(room))
    }).catch((err) => {
      dispatch(addMessage({
        title: 'Error connect to video chat',
        value: err,
        type: 'error'
      }))
    })
  }
}
