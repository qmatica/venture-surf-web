import {
  connect,
  ConnectOptions,
  Room,
  LocalDataTrack,
  createLocalTracks,
  createLocalVideoTrack,
  createLocalAudioTrack, LocalVideoTrack, LocalAudioTrack, LocalTrackPublication
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
  setDevices: (devices: MediaDeviceInfo[]) => (
    { type: 'VIDEO_CHAT__SET_DEVICES', devices } as const
  ),
  setIsGroup: (isGroup: boolean) => (
    { type: 'VIDEO_CHAT__SET_IS_GROUP', isGroup } as const
  ),
  setSelectedDevices: (devices: { [key: string]: string }) => (
    { type: 'VIDEO_CHAT__SET_SELECTED_DEVICES', devices } as const
  ),
  setViewEndCallAll: (viewEndCallAll: boolean) => (
    { type: 'VIDEO_CHAT__SET_VIEW_END_CALL_ALL', viewEndCallAll } as const
  ),
  setIsMyProfileIsOwnerOutgoingCall: () => (
    { type: 'VIDEO_CHAT__SET_IS_MY_PROFILE_IS_OWNER_OUTGOING_CALL' } as const
  ),
  reset: () => ({ type: 'VIDEO_CHAT__RESET' } as const)
}

export const connectToVideoRoom = (
  room: string,
  token: string,
  isGroup?: boolean
): ThunkType => async (dispatch, getState) => {
  const localDataTrack = new LocalDataTrack()

  if (isGroup) dispatch(actions.setIsGroup(isGroup))

  navigator.mediaDevices.enumerateDevices().then((devices) => {
    console.log('Media devices: ', devices)
    dispatch(actions.setDevices(devices))

    const selectedDevices: { [key: string]: string } = {}

    devices.forEach((device) => {
      let selectedDevice = localStorage.getItem(device.kind)

      if (!selectedDevice || !devices.some(({ deviceId }) => deviceId === selectedDevice)) {
        localStorage.setItem(device.kind, device.deviceId)
        selectedDevice = device.deviceId
      }

      if (!selectedDevices[device.kind]) selectedDevices[device.kind] = selectedDevice
    })

    dispatch(actions.setSelectedDevices(selectedDevices))

    return createLocalTracks({
      audio: { deviceId: selectedDevices.audioinput },
      video: { deviceId: selectedDevices.videoinput }
    })
  }).then((localTracks) => {
    console.log('LOCAL TRACKS: ', localTracks)
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

export const changeDevice = (kind: string, deviceId: string): ThunkType => async (dispatch, getState) => {
  const { room, selectedDevices } = getState().videoChat

  if (selectedDevices[kind] === deviceId) return

  localStorage.setItem(kind, deviceId)
  dispatch(actions.setSelectedDevices({ [kind]: deviceId }))

  if (room) {
    let track: LocalVideoTrack | LocalAudioTrack | undefined

    switch (kind) {
      case 'videoinput': {
        track = await createLocalVideoTrack({ deviceId })
        break
      }
      case 'audioinput': {
        track = await createLocalAudioTrack({ deviceId })
        break
      }
      default: break
    }

    if (track) {
      const { tracks } = room.localParticipant

      tracks.forEach((t) => {
        if (t.kind === track?.kind) {
          t.unpublish()
        }
      })

      room.localParticipant.publishTrack(track)
    }
  }
}
