import { Room } from 'twilio-video'
import { ActionTypes } from './types'

const initialState = {
  room: null as Room | null,
  viewEndCallAll: false,
  isOwnerCall: false
}

export const VideoChatReducer = (state = initialState, action: ActionTypes): typeof initialState => {
  switch (action.type) {
    case 'VIDEO_CHAT__SET_ROOM': {
      return {
        ...state,
        room: action.room
      }
    }
    case 'VIDEO_CHAT__SET_VIEW_END_CALL_ALL': {
      return {
        ...state,
        viewEndCallAll: action.viewEndCallAll
      }
    }
    case 'VIDEO_CHAT__SET_IS_OWNER_CALL': {
      return {
        ...state,
        isOwnerCall: true
      }
    }
    case 'VIDEO_CHAT__RESET':
      return initialState
    default: return state
  }
}
