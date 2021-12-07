import { Client as ConversationsClient } from '@twilio/conversations'
import { ActionTypes, ChatType } from './types'

const initialState = {
  client: null as ConversationsClient | null,
  chats: {} as ChatType,
  openedChat: '',
  preloader: false
}

export const ConversationsReducer = (state = initialState, action: ActionTypes): typeof initialState => {
  switch (action.type) {
    case 'CONVERSATIONS__SET_CONVERSATIONS_CLIENT':
      return {
        ...state,
        client: action.client
      }
    case 'CONVERSATIONS__SET_CHATS':
      return {
        ...state,
        chats: action.chats
      }
    case 'CONVERSATIONS__ADD_CHAT':
      return {
        ...state,
        chats: {
          ...state.chats,
          [action.payload.chat]: {
            chat: action.payload.chat,
            name: action.payload.name,
            photoUrl: action.payload.photoUrl,
            messages: [],
            missedMessages: 0,
            conversation: action.payload.conversation
          }
        }
      }
    case 'CONVERSATIONS__SET_OPENED_CHAT':
      return {
        ...state,
        openedChat: action.chat
      }
    case 'CONVERSATIONS__ADD_MESSAGE':
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
    case 'CONVERSATIONS__UPDATE_MESSAGE': {
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
    case 'CONVERSATIONS__TOGGLE_PRELOADER':
      return {
        ...state,
        preloader: !state.preloader
      }
    case 'CONVERSATIONS__RESET':
      return initialState
    default: return state
  }
}
