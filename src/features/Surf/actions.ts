import { usersAPI } from 'api'
import { UserType } from 'features/User/types'
import { addMessage } from 'features/Notifications/actions'
import { apiCodes } from 'common/types'
import { ThunkType } from './types'

export const actions = {
  setUsers: (users: any[]) => ({ type: 'SURF__SET_USERS', users } as const)
}

export const init = (): ThunkType => async (dispatch, getState) => {
  const { getMatches, getRecommended } = usersAPI
  const promise = await Promise.all([getMatches(), getRecommended()]).catch((err) => {
    dispatch(addMessage({
      title: 'Error loading surf users',
      value: err.error,
      type: 'error'
    }))
  })
  if (!promise) return
  const users = [...promise[0].matches, ...promise[1].recommendations]
  const formattedUsers = users.reduce((prevUsers, nextUser) => {
    const user: UserType = {
      ...nextUser,
      actions: {
        like() {
          dispatch(likeUser(user.uid))
        }
      },
      loaders: []
    }
    return [...prevUsers, user]
  }, [])
  dispatch(actions.setUsers(formattedUsers))
}

export const likeUser = (uid: string): ThunkType => async (dispatch, getState) => {
  const { users } = getState().surf
  const updatedUsers = [...users]
  const updatedIndexUser = users.findIndex((user) => user.uid === uid)
  updatedUsers[updatedIndexUser] = {
    ...updatedUsers[updatedIndexUser],
    loaders: [...updatedUsers[updatedIndexUser].loaders, 'like']
  }
  dispatch(actions.setUsers(updatedUsers))
  const status = await usersAPI.likeUser(uid).catch((err) => {
    dispatch(addMessage({
      title: 'Error like user',
      value: err.error,
      type: 'error'
    }))
  })
  if (status === apiCodes.success) {
    const { users } = getState().surf
    const updatedUsers = [...users]
    const updatedIndexUser = users.findIndex((user) => user.uid === uid)
    updatedUsers[updatedIndexUser] = {
      ...updatedUsers[updatedIndexUser],
      loaders: updatedUsers[updatedIndexUser].loaders.filter((loader) => loader !== 'like')
    }
    dispatch(actions.setUsers(updatedUsers))
  }
}
