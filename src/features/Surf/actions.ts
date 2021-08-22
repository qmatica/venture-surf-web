import { usersAPI } from 'api'
import { addMessage } from 'features/Notifications/actions'
import { actionsUser, EnumActionsUser } from 'features/User/constants'
import { apiCodes } from 'common/types'
import { UserType } from 'features/User/types'
import { addUserInLikesFromSurf } from 'features/Profile/actions'
import { ThunkType } from './types'

export const actions = {
  setUsers: (users: UserType[]) => ({ type: 'SURF__SET_USERS', users } as const)
}

export const init = (): ThunkType => async (dispatch, getState) => {
  const { getMatches, getRecommended } = usersAPI

  const promise = await Promise.all([getMatches(), getRecommended()]).catch((err) => {
    /*dispatch(addMessage({
      title: 'Error loading surf users',
      value: err.error,
      type: 'error'
    }))*/
    console.log(err.error)
  })

  if (!promise) return

  const users: UserType[] = [...promise[0].matches, ...promise[1].recommendations]

  const formattedUsers = users.map((user) => ({
    ...user,
    actions: {
      like: {
        onClick() {
          dispatch(like(user.uid))
        },
        title: 'Like',
        isActive: true,
        isLoading: false,
        type: EnumActionsUser.dynamic
      },
      withdrawLike: {
        onClick() {
          dispatch(withdrawLike(user.uid))
        },
        title: 'Withdraw like',
        isActive: false,
        isLoading: false,
        type: EnumActionsUser.dynamic
      }
    }
  }))

  dispatch(actions.setUsers(formattedUsers))
}

const togglePreloader = (
  uid: string,
  action: string
): ThunkType => (dispatch, getState) => {
  const { users } = getState().surf

  if (users) {
    const updatedUsers = [...users]
    const updatedUserIndex = users.findIndex((user) => user.uid === uid)

    if (updatedUserIndex >= 0) {
      updatedUsers[updatedUserIndex] = {
        ...updatedUsers[updatedUserIndex],
        actions: {
          ...updatedUsers[updatedUserIndex].actions,
          [action]: {
            ...updatedUsers[updatedUserIndex].actions[action],
            isLoading: !updatedUsers[updatedUserIndex].actions[action].isLoading
          }
        }
      }

      dispatch(actions.setUsers(updatedUsers))
    }
  }
}

const toggleActions = (
  uid: string,
  toggleActions: string[]
): ThunkType => (dispatch, getState) => {
  const { users } = getState().surf

  if (users) {
    const updatedUsers = [...users]
    const updatedUserIndex = users.findIndex((user) => user.uid === uid)

    if (updatedUserIndex >= 0) {
      updatedUsers[updatedUserIndex] = {
        ...updatedUsers[updatedUserIndex],
        actions: toggleActions.reduce((updatedActions, nextAction) => ({
          ...updatedActions,
          [nextAction]: {
            ...updatedActions[nextAction],
            isActive: !updatedActions[nextAction].isActive
          }
        }), updatedUsers[updatedUserIndex].actions)
      }

      dispatch(actions.setUsers(updatedUsers))
    }
  }
}

const like = (uid: string): ThunkType => async (dispatch) => {
  dispatch(togglePreloader(uid, 'like'))

  const status = await usersAPI.like(uid).catch((err) => {
    dispatch(addMessage({
      title: 'Error',
      value: err.error,
      type: 'error'
    }))
  })

  if (status === apiCodes.success) {
    dispatch(toggleActions(uid, ['like', 'withdrawLike']))
    dispatch(addUserInLikesFromSurf(uid))
  }

  dispatch(togglePreloader(uid, 'like'))
}

const withdrawLike = (uid: string): ThunkType => async (dispatch) => {
  dispatch(togglePreloader(uid, 'withdrawLike'))

  const status = await usersAPI.withdrawLike(uid).catch((err) => {
    dispatch(addMessage({
      title: 'Error',
      value: err.error,
      type: 'error'
    }))
  })

  if (status === apiCodes.success) {
    dispatch(toggleActions(uid, ['like', 'withdrawLike']))
  }

  dispatch(togglePreloader(uid, 'withdrawLike'))
}
