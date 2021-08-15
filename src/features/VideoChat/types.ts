import { ThunkAction } from 'redux-thunk'
import { getFirebase } from 'react-redux-firebase'
import { AppStateType, InferActionsTypes } from '../../common/types'
import { actions } from './actions'

export type ActionTypes = InferActionsTypes<typeof actions>
export type ThunkType = ThunkAction<Promise<void | boolean>, AppStateType, typeof getFirebase, ActionTypes>

export type NotificationType = {
    type: 'incomingСall' | 'scheduledCall',
    request: string,
    user: {
        uid: string,
        photoURL: string,
        displayName: string
    },
    actions: {
        accept: () => void,
        decline: () => void
    }
}
