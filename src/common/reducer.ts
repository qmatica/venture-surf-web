import { ActionTypes } from './types'

const initialState = {
  initialized: false,
  isFullScreen: false
}

export const AppReducer = (state = initialState, action: ActionTypes): typeof initialState => {
  switch (action.type) {
    case 'APP__SET_INITIALIZED':
      return {
        ...state,
        initialized: action.initialized
      }
    case 'APP__SET_IS_FULL_SCREEN':
      return {
        ...state,
        isFullScreen: action.isFullScreen
      }
    default: return state
  }
}
