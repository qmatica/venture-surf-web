import { Room } from 'twilio-video'
import { ActionTypes, NotificationType } from './types'

const initialState = {
  room: null as Room | null,
  remoteUserUid: null as string | null,
  notifications: [] as NotificationType[]
}

export const VideoChatReducer = (state = initialState, action: ActionTypes): typeof initialState => {
  switch (action.type) {
    case 'VIDEO_CHAT__OPEN': {
      return {
        ...state,
        room: action.payload.room,
        remoteUserUid: action.payload.remoteUserUid
      }
    }
    case 'VIDEO_CHAT__SET_NOTIFICATION': {
      return {
        ...state,
        notifications: [...state.notifications, action.notification]
      }
    }
    case 'VIDEO_CHAT__CLEAR_NOTIFICATION': {
      return {
        ...state,
        notifications: state.notifications.filter((notification) => notification.request !== action.notificationRequest)
      }
    }
    default: return state
  }
}
