import { ActionTypes, surfUser } from './types'

const initialState = {
  users: [] as surfUser[]
}

export const SurfReducer = (state = initialState, action: ActionTypes): typeof initialState => {
  switch (action.type) {
    case 'SURF__SET_USERS':
      return {
        ...state,
        users: action.users
      }
    default:
      return state
  }
}
