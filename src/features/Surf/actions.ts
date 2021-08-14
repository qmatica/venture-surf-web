import { usersAPI } from 'api'
import { addMessage } from 'features/Notifications/actions'
import { actionsUser } from 'features/User/constants'
import { apiCodes } from 'common/types'
import { ThunkType } from './types'
import { updateUsers } from './utils'

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

  const formattedUsers = users.map((user) => ({
    ...user,
    bodyActions: {
      like() {
        dispatch(likeUser(user.uid))
      },
      withdrawLike() {
        dispatch(withdrawLikeUser(user.uid))
      }
    },
    activeActions: [actionsUser.like],
    loaders: []
  }))

  dispatch(actions.setUsers(formattedUsers))
}

export const likeUser = (uid: string): ThunkType => async (dispatch, getState) => {
  const { users } = getState().surf

  const updatedUsers = updateUsers({
    users,
    updatedUserId: uid,
    loader: actionsUser.like.action
  })

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

    const updatedUsers = updateUsers({
      users,
      updatedUserId: uid,
      loader: actionsUser.like.action,
      activeActions: [actionsUser.withdrawLike]
    })

    dispatch(actions.setUsers(updatedUsers))
  }
}

export const withdrawLikeUser = (uid: string): ThunkType => async (dispatch, getState) => {
  const { users } = getState().surf

  const updatedUsers = updateUsers({
    users,
    updatedUserId: uid,
    loader: actionsUser.withdrawLike.action
  })

  dispatch(actions.setUsers(updatedUsers))

  const status = await usersAPI.withdrawLike(uid).catch((err) => {
    dispatch(addMessage({
      title: 'Error like user',
      value: err.error,
      type: 'error'
    }))
  })

  if (status === apiCodes.success) {
    const { users } = getState().surf

    const updatedUsers = updateUsers({
      users,
      updatedUserId: uid,
      loader: actionsUser.withdrawLike.action,
      activeActions: [actionsUser.like]
    })

    dispatch(actions.setUsers(updatedUsers))
  }
}
