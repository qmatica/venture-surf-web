import { ThunkAction } from 'redux-thunk'
import { getFirebase } from 'react-redux-firebase'
import { AppStateType, InferActionsTypes } from '../../common/types'
import { actions } from './actions'

export type ActionTypes = InferActionsTypes<typeof actions>
export type ThunkType = ThunkAction<Promise<void | boolean>, AppStateType, typeof getFirebase, ActionTypes>

export type timeSlotsType = {
  [key in 'add' & 'del' & 'disable' & 'enable']: string[]
}

export type FormattedSlotType = {
  date: string,
  duration: number
  request?: string
  status: string
  twilio?: {
    made: {
      seconds: number
      nanoseconds: number
    }
    room: string
    token: string
  }
  uid?: string
  disabled?: []
  reccurent?: string
  reccurentIndex?: number
  parentDate?: string
}

export type FormattedSlotsType = FormattedSlotType[]

export type SlotType = 'Z' | 'W' | 'D' | 'custom'
