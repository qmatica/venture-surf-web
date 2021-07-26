import { ThunkAction } from 'redux-thunk'
import { getFirebase } from 'react-redux-firebase'
import { actions } from './actions'
import { AppStateType, InferActionsTypes } from '../../common/types'

export type ActionTypes = InferActionsTypes<typeof actions>
export type ThunkType = ThunkAction<Promise<void | boolean>, AppStateType, typeof getFirebase, ActionTypes>
