import { Room } from 'twilio-video'
import { ActionTypes } from './types'

const initialState = {
  room: null as Room | null,
  remoteUserUid: null as string | null,
  viewEndCallAll: false
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
    case 'VIDEO_CHAT__SET_VIEW_END_CALL_ALL': {
      return {
        ...state,
        viewEndCallAll: action.viewEndCallAll
      }
    }
    case 'VIDEO_CHAT__RESET':
      return initialState
    default: return state
  }
}
