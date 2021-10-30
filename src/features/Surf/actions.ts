import { usersAPI } from 'api'
import { addMessage } from 'features/Notifications/actions'
import { apiCodes } from 'common/types'
import { UserType } from 'features/User/types'
import { actions as profileActions } from 'features/Profile/actions'
import { ThunkType } from './types'

export const actions = {
  setRecommendedUsers: (recommendedUsers: UserType[]) => (
    { type: 'SURF__SET_RECOMMENDED_USERS', recommendedUsers } as const
  ),
  setUsers: (users: UserType[]) => ({ type: 'SURF__SET_USERS', users } as const),
  addUser: (user: UserType) => ({ type: 'SURF__ADD_USER', user } as const),
  removeUser: (user: UserType) => ({ type: 'SURF__REMOVE_USER', user } as const)
}

export const init = (): ThunkType => async (dispatch, getState) => {
  const { getMatches, getRecommended } = usersAPI

  const response = await Promise.all([getRecommended(), getMatches()]).catch((err) => {
    /*dispatch(addMessage({
      title: 'Error loading surf users',
      value: err.error,
      type: 'error'
    }))*/
    console.log(err.error)
  })

  if (!response) return

  const recommendedUsers: UserType[] = response[0].recommendations

  // const formattedRecommendedUsers = recommendedUsers.reduce((prevUsers, nextUser) => {}, [])

  dispatch(actions.setRecommendedUsers(recommendedUsers))

  const users: UserType[] = response[1].matches

  dispatch(actions.setUsers(users))
}

export const like = (uid: string, action: 'like' | 'withdrawLike'): ThunkType => async (dispatch, getState) => {
  const { users } = getState().surf

  if (users) {
    const updatedUsers = [...users]
    const updatedUserIndex = users.findIndex((user) => user.uid === uid)

    if (updatedUserIndex >= 0) {
      updatedUsers[updatedUserIndex] = {
        ...updatedUsers[updatedUserIndex],
        loading: [action],
        clickedAction: `surf-${action}`
      }
      dispatch(actions.setUsers(updatedUsers))

      const status = await usersAPI[action](uid).catch((err) => {
        dispatch(addMessage({
          title: 'Error',
          value: err.error,
          type: 'error'
        }))
      })

      if (status === apiCodes.success) {
        const { users } = getState().surf
        const updatedUsers = [...users]

        updatedUsers[updatedUserIndex] = {
          ...updatedUsers[updatedUserIndex],
          loading: []
        }
        dispatch(actions.setUsers(updatedUsers))

        const profileAction = action === 'like' ? 'addUserInMyContacts' : 'removeUserInMyContacts'

        dispatch(profileActions[profileAction](updatedUsers[updatedUserIndex], 'likes'))
      }
    }
  }
}
