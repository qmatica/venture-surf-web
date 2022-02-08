import { UserType } from 'features/User/types'
import { Message } from '@twilio/conversations/lib/message'
import { ActionTypes, IncomingCallType, NotificationsHistoryType } from './types'

const initialState = {
  history: {} as NotificationsHistoryType,
  isLoadedHistory: false,
  anyMsgs: [] as { msg: string, uid: string }[],
  errorMsg: null as string | null,
  contactsEventsMsgs: [] as { user: UserType, msg: string, uidMsg: string }[],
  receivedChatMsgs: [] as { user: UserType, msg: Message }[],
  scheduledMeetMsgs: [] as { date: string, name: string, uid: string, uidMsg: string, secondsToMeet: number }[],
  incomingCall: null as IncomingCallType | null
}

export const NotificationsReducer = (state = initialState, action: ActionTypes) => {
  switch (action.type) {
    case 'NOTIFICATIONS__SET_HISTORY': {
      return {
        ...state,
        history: action.history
      }
    }
    case 'NOTIFICATIONS__SET_IS_LOADED_HISTORY': {
      return {
        ...state,
        isLoadedHistory: action.isLoadedHistory
      }
    }
    case 'NOTIFICATIONS__ADD_ANY_MESSAGE': {
      return {
        ...state,
        anyMsgs: [...state.anyMsgs, action.message]
      }
    }
    case 'NOTIFICATIONS__REMOVE_ANY_MESSAGE':
      return {
        ...state,
        anyMsgs: state.anyMsgs.filter((message) => message.uid !== action.uid)
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
    case 'NOTIFICATIONS__ADD_SCHEDULED_MEET_MSG':
      return {
        ...state,
        scheduledMeetMsgs: [...state.scheduledMeetMsgs, action.payload]
      }
    case 'NOTIFICATIONS__REMOVE_SCHEDULED_MEET_MSG':
      return {
        ...state,
        scheduledMeetMsgs: state.scheduledMeetMsgs.filter((msg) => msg.uidMsg !== action.uidMsg)
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
