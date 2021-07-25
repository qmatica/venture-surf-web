import { AppStateType, InferActionsTypes } from 'common/types'
import { ThunkAction } from 'redux-thunk'
import { actions } from './actions'

export type ActionTypes = InferActionsTypes<typeof actions>
export type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionTypes>

export type ModalButtonType = {
    title: string
    className: string
    action?: () => void
    preloader?: boolean
}
