import { AppStateType, InferActionsTypes } from 'common/types'
import { ThunkAction } from 'redux-thunk'
import { getFirebase } from 'react-redux-firebase'
import { actions as actionsNotifications } from 'features/Notifications/actions'
import { actions } from './actions'

export type ActionTypes = InferActionsTypes<typeof actions| typeof actionsNotifications>
export type ThunkType = ThunkAction<Promise<void>, AppStateType, typeof getFirebase, ActionTypes>
