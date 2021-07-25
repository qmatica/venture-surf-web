import { ThunkAction } from 'redux-thunk'
import { getFirebase } from 'react-redux-firebase'
import { AppStateType, InferActionsTypes } from 'common/types'
import { actions as profileActions } from 'features/Profile/actions'
import { actions } from './actions'

export type ActionTypes = InferActionsTypes<typeof actions | typeof profileActions>
export type ThunkType = ThunkAction<Promise<void>, AppStateType, typeof getFirebase, ActionTypes>
