import { UserType } from 'features/User/types'
import { Message } from '@twilio/conversations/lib/message'
import { ActionTypes, IncomingCallType, MessageType } from './types'

const initialState = {
  messages: [] as MessageType[],
  errorMsg: null as string | null,
  contactsEventsMsgs: [] as { user: UserType, msg: string, uidMsg: string }[],
  receivedChatMsgs: [] as { user: UserType, msg: Message }[],
  incomingCall: null as IncomingCallType | null
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
    case 'NOTIFICATIONS__ADD_ERROR_MSG':
      return {
        ...state,
        errorMsg: action.msg
      }
    case 'NOTIFICATIONS__REMOVE_ERROR_MSG':
      return {
        ...state,
        errorMsg: null
      }
    case 'NOTIFICATIONS__ADD_CONTACTS_EVENT_MSG':
      return {
        ...state,
        contactsEventsMsgs: [...state.contactsEventsMsgs, action.payload]
      }
    case 'NOTIFICATIONS__REMOVE_CONTACTS_EVENT_MSG':
      return {
        ...state,
        contactsEventsMsgs: state.contactsEventsMsgs.filter((event) => event.uidMsg !== action.uidMsg)
      }
    case 'NOTIFICATIONS__ADD_RECEIVED_CHAT_MSG':
      return {
        ...state,
        receivedChatMsgs: [...state.receivedChatMsgs, action.payload]
      }
    case 'NOTIFICATIONS__REMOVE_RECEIVED_CHAT_MSG':
      return {
        ...state,
        receivedChatMsgs: state.receivedChatMsgs.filter((msg) => msg.msg.sid !== action.sid)
      }
    case 'NOTIFICATIONS__ADD_INCOMING_CALL':
      return {
        ...state,
        incomingCall: action.payload
      }
    case 'NOTIFICATIONS__REMOVE_INCOMING_CALL':
      return {
        ...state,
        incomingCall: null
      }
    default:
      return state
  }
}
