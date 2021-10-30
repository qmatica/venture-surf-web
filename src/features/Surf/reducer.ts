import { UserType } from 'features/User/types'
import { ActionTypes } from './types'

const initialState = {
  recommendedUsers: [] as UserType[],
  users: [] as UserType[]
}

export const SurfReducer = (state = initialState, action: ActionTypes): typeof initialState => {
  switch (action.type) {
    case 'SURF__SET_RECOMMENDED_USERS':
      return {
        ...state,
        recommendedUsers: action.recommendedUsers
      }
    case 'SURF__SET_USERS':
      return {
        ...state,
        users: action.users
      }
    case 'SURF__ADD_USER': {
      const updatedUserIndex = state.users.findIndex((user) => user.uid === action.user.uid)

      if (updatedUserIndex !== -1) {
        const updatedUsers = [...state.users]
        updatedUsers.splice(updatedUserIndex, 1, action.user)

        return {
          ...state,
          users: updatedUsers
        }
      }

      return {
        ...state,
        users: [...state.users, action.user]
      }
    }
    case 'SURF__REMOVE_USER': {
      const updatedUsers = [...state.users]
      const removedUserIndex = updatedUsers.findIndex((user) => user.uid === action.user.uid)

      if (removedUserIndex === -1) {
        return state
      }

      updatedUsers.splice(removedUserIndex, 1)

      return {
        ...state,
        users: updatedUsers
      }
    }
    default:
      return state
  }
}
