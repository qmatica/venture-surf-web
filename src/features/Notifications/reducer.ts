import { ActionTypes, MessageType } from './types'

const initialState = {
  messages: [] as MessageType[]
}

export const NotificationsReducer = (state = initialState, action: ActionTypes) => {
  switch (action.type) {
    case 'NOTIFICATIONS__ADD_MESSAGE': {
      return {
        ...state,
        messages: [...state.messages, action.message]
      }
    }
    case 'NOTIFICATIONS__CLEAR_MESSAGE':
      return {
        ...state,
        messages: state.messages.filter((message) => message.value !== action.message.value)
      }
    default:
      return state
  }
}
