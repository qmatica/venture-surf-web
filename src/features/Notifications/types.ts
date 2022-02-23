import { ThunkAction } from 'redux-thunk'
import { getFirebase } from 'react-redux-firebase'
import { AppStateType, InferActionsTypes } from 'common/types'
import { actions as actionsConversations } from 'features/Conversations/actions'
import { actions } from './actions'

export type ActionTypes = InferActionsTypes<typeof actions | typeof actionsConversations>
export type ThunkType = ThunkAction<Promise<void | boolean>, AppStateType, typeof getFirebase, ActionTypes>

export type IncomingCallType = {
    uid: string
    name: string
    photoURL: string
    room: string
    token: string
}

export type NotificationsHistoryType = {
    [key: string]: ValueNotificationsHistoryType
}

export type ValueNotificationsHistoryType = {
    contact: string
    data: { [key: string]: any }
    status: 'active' | 'read' | string
    ts: string
    type: 'call_instant'
      | 'call_instant_group'
      | 'call_canceled'
      | 'call_declined'
      | 'mutual_like'
      | 'like'
      | 'intro'
      | 'intro_you'
      | 'invest'
    uid: string
    count?: number
}
