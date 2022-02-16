import { ThunkAction } from 'redux-thunk'
import { getFirebase } from 'react-redux-firebase'
import {
  AppStateType, InferActionsTypes
} from 'common/types'
import { actions as profileActions } from 'features/Profile/actions'
import { actions as notificationsActions } from 'features/Notifications/actions'
import { actions as contactsActions } from 'features/Contacts/actions'
import { actions } from './actions'

export type ActionTypes = InferActionsTypes<
  | typeof actions
  | typeof profileActions
  | typeof notificationsActions
  | typeof contactsActions
>
export type ThunkType = ThunkAction<Promise<void | boolean> | void, AppStateType, typeof getFirebase, ActionTypes>
