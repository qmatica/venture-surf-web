import { usersAPI } from 'api'
import { ThunkType } from './types'
import { addMessage } from '../Notifications/actions'

export const actions = {
  setUsers: (users: any[]) => ({ type: 'SURF__SET_USERS', users } as const)
}

export const init = (): ThunkType => async (dispatch, getState) => {
  const { getMatches, getRecommended } = usersAPI
  const promise = await Promise.all([getMatches(), getRecommended()]).catch((err) => {
    dispatch(addMessage(err.error))
  })
  if (!promise) return
  const users = [...promise[0].matches, ...promise[1].recommendations]
  const formattedUsers = users.reduce((prevUsers, nextUser) => {
    const user = {
      ...nextUser,
      actions: {
        like: () => dispatch(likeUser(nextUser.uId))
      }
    }
    return [...prevUsers, user]
  }, [])
  dispatch(actions.setUsers(formattedUsers))
}

export const likeUser = (userId: string): ThunkType => async (dispatch, getState) => {
  const { users } = getState().surf
  const updatedUsers = [...users]
  const updatedIndexUser = users.findIndex((user) => user.uid === userId)
  updatedUsers[updatedIndexUser] = {
    ...updatedUsers[updatedIndexUser],
    loading: [...updatedUsers[updatedIndexUser].loading, 'like']
  }
  dispatch(actions.setUsers(updatedUsers))
  const response = await usersAPI.likeUser(userId)
  console.log(response)
}
