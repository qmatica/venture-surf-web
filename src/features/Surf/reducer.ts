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
    case 'SURF__UPDATE_RECOMMENDED_USER':
      /* eslint-disable no-case-declarations */
      /* eslint-disable arrow-body-style */
      const updatedRecommendedUserIndex = state.recommendedUsers.findIndex((user) => {
        return user.uid === action.recommendedUser.uid
      })

      if (updatedRecommendedUserIndex !== -1) {
        const updatedRecommendedUsers = [...state.recommendedUsers]
        updatedRecommendedUsers.splice(updatedRecommendedUserIndex, 1, action.recommendedUser)

        return {
          ...state,
          recommendedUsers: updatedRecommendedUsers
        }
      }
      return state
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
