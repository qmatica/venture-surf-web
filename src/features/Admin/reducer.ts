import { ActionTypes } from './types'

const initialState = {
  isAdminMode: false,
  isLoading: false,
  users: [] as any[]
}

export const AdminReducer = (state = initialState, action: ActionTypes): typeof initialState => {
  switch (action.type) {
    case 'ADMIN__SET_IS_ADMIN_MODE':
      return {
        ...state,
        isAdminMode: action.isAdmin
      }
    case 'ADMIN__SET_USERS':
      return {
        ...state,
        users: action.users
      }
    case 'ADMIN__SET_IS_LOADING':
      return {
        ...state,
        isLoading: action.isLoading
      }
    default: return state
  }
}
