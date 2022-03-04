import {
  connect,
  ConnectOptions,
  Room,
  LocalDataTrack,
  createLocalTracks
} from 'twilio-video'
import { actions as actionsNotifications } from 'features/Notifications/actions'
import { ThunkType } from './types'

export const actions = {
  setRoom: (room: Room | null) => (
    { type: 'VIDEO_CHAT__SET_ROOM', room } as const
  ),
  setLocalDataTrack: (localDataTrack: LocalDataTrack) => (
    { type: 'VIDEO_CHAT__SET_LOCAL_DATA_TRACK', localDataTrack } as const
  ),
  setViewEndCallAll: (viewEndCallAll: boolean) => (
    { type: 'VIDEO_CHAT__SET_VIEW_END_CALL_ALL', viewEndCallAll } as const
  ),
  setIsOwnerCall: () => (
    { type: 'VIDEO_CHAT__SET_IS_OWNER_CALL' } as const
  ),
  reset: () => ({ type: 'VIDEO_CHAT__RESET' } as const)
}

export const connectToVideoRoom = (room: string, token: string): ThunkType =>
  async (dispatch, getState) => {
    const localDataTrack = new LocalDataTrack()

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      console.log('Media devices: ', devices)
      const videoInput = devices.find((device) => device.kind === 'videoinput')
      if (videoInput) {
        return createLocalTracks({ audio: true, video: { deviceId: videoInput.deviceId } })
      }
      return []
    }).then((localTracks) => {
      connect(token, {
        room,
        dominantSpeaker: true,
        tracks: [...localTracks, localDataTrack]
      } as ConnectOptions)
        .then((room) => {
          dispatch(actions.setRoom(room))
          dispatch(actions.setLocalDataTrack(localDataTrack))
        })
        .catch((err) => {
          dispatch(actionsNotifications.addErrorMsg(JSON.stringify(err)))
        })
    })
  }
