import { ThunkAction } from 'redux-thunk'
import { getFirebase } from 'react-redux-firebase'
import { AppStateType, InferActionsTypes } from 'common/types'
import { actions } from './actions'

export type ActionTypes = InferActionsTypes<typeof actions>
export type ThunkType = ThunkAction<Promise<void | boolean> | void, AppStateType, typeof getFirebase, ActionTypes>

export type DialogType = {
  [key: string]: {
    chat: string
    name: string
    photoUrl: string
    messages: MessageType[]
    missedMessages: number
  }
}

export type MessageType = {
  account_sid: string,
  attributes: string,
  author: string,
  body: string,
  conversation_sid: string,
  date_created: string,
  date_updated: string,
  delivery: null,
  index: number,
  links: {
    delivery_receipts: string
  },
  delivery_receipts: string,
  media: null,
  participant_sid: null,
  sid: string,
  url: string,
  notRead: boolean // Не прочитанное сообщение
}
