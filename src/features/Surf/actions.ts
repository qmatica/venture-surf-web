import { usersAPI } from 'api'
import { apiCodes } from 'common/types'
import { UserType } from 'features/User/types'
import { actions as profileActions } from 'features/Profile/actions'
import { actions as notificationsActions } from 'features/Notifications/actions'
import { deleteFieldsOfObject } from 'common/utils'
import { ThunkType } from './types'

export const actions = {
  setRecommendedUsers: (recommendedUsers: UserType[]) => (
    { type: 'SURF__SET_RECOMMENDED_USERS', recommendedUsers } as const
  ),
  updateRecommendedUser: (recommendedUser: UserType) => (
    { type: 'SURF__UPDATE_RECOMMENDED_USER', recommendedUser } as const
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

  const formattedRecommendedUsers = recommendedUsers.reduce((prevUsers, nextUser) => {
    if (nextUser.recommended_by) {
      const { recommended_message } = nextUser

      const recommendedByList = !prevUsers[nextUser.uid]
        ? [{ ...nextUser.recommended_by, recommended_message }]
        : [...prevUsers[nextUser.uid].recommendedByList, { ...nextUser.recommended_by, recommended_message }]

      let newUser = {
        ...nextUser,
        recommendedByList
      }

      newUser = deleteFieldsOfObject(
        newUser,
        ['recommended_message', 'recommended_by', 'reason', 'recommended_at']
      )

      return {
        ...prevUsers,
        [nextUser.uid]: newUser
      }
    }
    return prevUsers
  }, {} as { [key: string]: UserType })

  dispatch(actions.setRecommendedUsers(Object.values(formattedRecommendedUsers)))

  const users: UserType[] = response[1].matches

  dispatch(actions.setUsers(users))
}

export const like = (
  uid: string,
  isRecommended: boolean,
  action: 'like' | 'withdrawLike'
): ThunkType => async (dispatch, getState) => {
  const usersList = isRecommended ? 'recommendedUsers' : 'users'
  const actionType = isRecommended ? 'setRecommendedUsers' : 'setUsers'

  const users = getState().surf[usersList]

  if (users) {
    const updatedUsers = [...users]
    const updatedUserIndex = users.findIndex((user) => user.uid === uid)

    if (updatedUserIndex >= 0) {
      updatedUsers[updatedUserIndex] = {
        ...updatedUsers[updatedUserIndex],
        loading: [action],
        clickedAction: `surf-${action}`
      }
      dispatch(actions[actionType](updatedUsers))

      const status = await usersAPI[action](uid).catch((err) => {
        dispatch(notificationsActions.addErrorMsg(JSON.stringify(err)))
      })

      if (status === apiCodes.success) {
        const users = getState().surf[usersList]
        const updatedUsers = [...users]

        updatedUsers[updatedUserIndex] = {
          ...updatedUsers[updatedUserIndex],
          loading: []
        }
        dispatch(actions[actionType](updatedUsers))

        const profileAction = action === 'like' ? 'addUserInMyContacts' : 'removeUserInMyContacts'

        dispatch(profileActions[profileAction](updatedUsers[updatedUserIndex], 'likes'))
      }
    }
  }
}
