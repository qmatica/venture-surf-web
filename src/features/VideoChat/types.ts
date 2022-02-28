import { ThunkAction } from 'redux-thunk'
import { getFirebase } from 'react-redux-firebase'
import { AppStateType, InferActionsTypes } from 'common/types'
import { actions as actionsNotifications } from 'features/Notifications/actions'
import { Participant } from 'twilio-video'
import { actions } from './actions'

export type ActionTypes = InferActionsTypes<typeof actions | typeof actionsNotifications>
export type ThunkType = ThunkAction<Promise<void | boolean>, AppStateType, typeof getFirebase, ActionTypes>

export type MapParticipantsType = { [sid: string]: Participant }
