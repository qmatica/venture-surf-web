import { ActionTypes, ChatType } from './types'

const initialState = {
  chats: {} as ChatType,
  preloader: false
}

export const InboxReducer = (state = initialState, action: ActionTypes): typeof initialState => {
  switch (action.type) {
    case 'INBOX__SET_CHATS':
      return {
        ...state,
        chats: action.chats
      }
    case 'INBOX__ADD_MESSAGE':
      return {
        ...state,
        chats: {
          ...state.chats,
          [action.payload.chat]: {
            ...state.chats[action.payload.chat],
            messages: [
              ...state.chats[action.payload.chat].messages,
              action.payload.message
            ]
          }
        }
      }
    case 'INBOX__UPDATE_MESSAGE': {
      const updatedChatMessages = [...state.chats[action.payload.chat].messages]

      updatedChatMessages[action.payload.message.index] = action.payload.message

      return {
        ...state,
        chats: {
          ...state.chats,
          [action.payload.chat]: {
            ...state.chats[action.payload.chat],
            messages: updatedChatMessages
          }
        }
      }
    }
    default: return state
  }
}
