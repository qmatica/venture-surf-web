import { UserType } from 'features/User/types'
import { Message } from '@twilio/conversations/lib/message'
import { IncomingCallType, MessageType, ThunkType } from './types'

export const actions = {
  addMessage: (message: MessageType) => ({ type: 'NOTIFICATIONS__ADD_MESSAGE', message } as const),
  clearMessage: (message: MessageType) => ({ type: 'NOTIFICATIONS__CLEAR_MESSAGE', message } as const),
  addErrorMsg: (msg: string) => ({ type: 'NOTIFICATIONS__ADD_ERROR_MSG', msg } as const),
  removeErrorMsg: () => ({ type: 'NOTIFICATIONS__REMOVE_ERROR_MSG' } as const),
  addContactsEventMsg: (user: UserType, msg: string, uidMsg: string) => (
    { type: 'NOTIFICATIONS__ADD_CONTACTS_EVENT_MSG', payload: { user, msg, uidMsg } } as const
  ),
  removeContactsEventMsg: (uidMsg: string) => ({ type: 'NOTIFICATIONS__REMOVE_CONTACTS_EVENT_MSG', uidMsg } as const),
  addReceivedChatMsg: (user: UserType, msg: Message) => (
    { type: 'NOTIFICATIONS__ADD_RECEIVED_CHAT_MSG', payload: { user, msg } } as const
  ),
  removeReceivedChatMsg: (sid: string) => ({ type: 'NOTIFICATIONS__REMOVE_RECEIVED_CHAT_MSG', sid } as const),
  addIncomingCall: (payload: IncomingCallType) => ({ type: 'NOTIFICATIONS__ADD_INCOMING_CALL', payload } as const),
  removeIncomingCall: () => ({ type: 'NOTIFICATIONS__REMOVE_INCOMING_CALL' } as const)
}

export const addMessage = (message: MessageType): ThunkType => async (dispatch, getState) => {
  setTimeout(() => {
    dispatch(actions.clearMessage(message))
  }, 150000)
  dispatch(actions.addMessage(message))
}
