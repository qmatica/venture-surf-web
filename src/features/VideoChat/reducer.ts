import { Room } from 'twilio-video'
import { ActionTypes } from './types'

const initialState = {
  room: null as Room | null,
  remoteUserUid: null as string | null
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
    default: return state
  }
}
