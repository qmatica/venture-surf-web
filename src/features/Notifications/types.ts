import { ThunkAction } from 'redux-thunk'
import { getFirebase } from 'react-redux-firebase'
import { AppStateType, InferActionsTypes } from 'common/types'
import { actions as actionsConversations } from 'features/Conversations/actions'
import { actions } from './actions'

export type ActionTypes = InferActionsTypes<typeof actions | typeof actionsConversations>
export type ThunkType = ThunkAction<Promise<void | boolean>, AppStateType, typeof getFirebase, ActionTypes>

export type IncomingCallType = {
    data: {
        made: Date | { seconds: number, nanoseconds: number }
        room: string
        slots: string
        token: string
        uid: string
    }
    notification: {
        body: string
        title: string
    }
}
