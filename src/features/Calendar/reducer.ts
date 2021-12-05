import { ActionTypes } from './types'

const initialState = {
  closedNotify: [] as string[]
}

export const CalendarReducer = (state = initialState, action: ActionTypes): typeof initialState => {
  switch (action.type) {
    case 'CALENDAR__ADD_CLOSED_NOTIFY':
      return {
        ...state,
        closedNotify: [...state.closedNotify, action.dateSlot]
      }
    default: return state
  }
}
