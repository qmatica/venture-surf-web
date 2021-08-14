import { Room } from 'twilio-video'
import { ActionTypes } from './types'

const initialState = {
  room: null as Room | null
}

export const VideoChatReducer = (state = initialState, action: ActionTypes): typeof initialState => {
  switch (action.type) {
    case 'VIDEO_CHAT__OPEN': {
      return {
        ...state,
        room: action.payload.room
      }
    }
    default: return state
  }
}
