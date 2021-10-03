import { ThunkAction } from 'redux-thunk'
import { getFirebase } from 'react-redux-firebase'
import { AppStateType, InferActionsTypes } from 'common/types'
import { actions as actionsNotifications } from 'features/Notifications/actions'
import Conversation from '@twilio/conversations/lib/conversation'
import { Message } from '@twilio/conversations/lib/message'
import { actions } from './actions'

export type ActionTypes = InferActionsTypes<typeof actions | typeof actionsNotifications>
export type ThunkType = ThunkAction<Promise<void | boolean> | void, AppStateType, typeof getFirebase, ActionTypes>

export type ChatType = {
  [key: string]: {
    chat: string
    name: string
    photoUrl: string
    messages: (Message | MessageType)[]
    missedMessages: number
    conversation?: Conversation.Conversation
  }
}

export type MessageType = {
  author: string
  body: string
  dateCreated: Date
  dateUpdated: Date
  index: number
  sid: string
  aggregatedDeliveryReceipt: null
}
