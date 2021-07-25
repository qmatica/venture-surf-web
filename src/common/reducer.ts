import { ActionTypes } from './types'

const initialState = {
  initialized: false
}

export const AppReducer = (state = initialState, action: ActionTypes): typeof initialState => {
  switch (action.type) {
    case 'APP__SET_INITIALIZED':
      return {
        ...state,
        initialized: action.initialized
      }
    default: return state
  }
}
