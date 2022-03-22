import { Room, LocalDataTrack } from 'twilio-video'
import { ActionTypes, DevicesType } from './types'

const initialState = {
  room: null as Room | null,
  localDataTrack: null as LocalDataTrack | null,
  devices: {} as DevicesType,
  selectedDevices: {} as { [key: string]: string },
  isGroup: false,
  viewEndCallAll: false,
  isMyProfileIsOwnerOutgoingCall: false
}

export const VideoChatReducer = (state = initialState, action: ActionTypes): typeof initialState => {
  switch (action.type) {
    case 'VIDEO_CHAT__SET_ROOM': {
      return {
        ...state,
        room: action.room
      }
    }
    case 'VIDEO_CHAT__SET_LOCAL_DATA_TRACK': {
      return {
        ...state,
        localDataTrack: action.localDataTrack
      }
    }
    case 'VIDEO_CHAT__SET_DEVICES': {
      const devices = action.devices.reduce((prevDevices, nextDevice) => {
        if (nextDevice.kind) {
          return {
            ...prevDevices,
            [nextDevice.kind]: prevDevices[nextDevice.kind]
              ? [...prevDevices[nextDevice.kind], nextDevice]
              : [nextDevice]
          }
        }
        return prevDevices
      }, {} as DevicesType)

      return {
        ...state,
        devices
      }
    }
    case 'VIDEO_CHAT__SET_IS_GROUP': {
      return {
        ...state,
        isGroup: action.isGroup
      }
    }
    case 'VIDEO_CHAT__SET_SELECTED_DEVICES': {
      return {
        ...state,
        selectedDevices: { ...state.selectedDevices, ...action.devices }
      }
    }
    case 'VIDEO_CHAT__SET_VIEW_END_CALL_ALL': {
      return {
        ...state,
        viewEndCallAll: action.viewEndCallAll
      }
    }
    case 'VIDEO_CHAT__SET_IS_MY_PROFILE_IS_OWNER_OUTGOING_CALL': {
      return {
        ...state,
        isMyProfileIsOwnerOutgoingCall: true
      }
    }
    case 'VIDEO_CHAT__RESET':
      return initialState
    default: return state
  }
}
