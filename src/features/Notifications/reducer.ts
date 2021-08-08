import { ActionTypes } from './types'

const initialState = {
  messages: [] as string[]
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
        messages: state.messages.filter((message) => message !== action.message)
      }
    default:
      return state
  }
}
