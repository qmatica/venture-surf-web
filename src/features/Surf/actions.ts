import { usersAPI } from 'api'
import { addMessage } from 'features/Notifications/actions'
import { actionsUser, EnumActionsUser } from 'features/User/constants'
import { apiCodes } from 'common/types'
import { UserType } from 'features/User/types'
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
        async onClick() {
          await usersAPI.like(user.uid)
        },
        title: 'Like',
        isActive: true,
        isLoading: false,
        type: EnumActionsUser.dynamic
      },
      withdrawLike: {
        onClick() {
          console.log('Withdraw like')
        },
        title: 'Like',
        isActive: false,
        isLoading: false,
        type: EnumActionsUser.dynamic
      }
    }
  }))

  dispatch(actions.setUsers(formattedUsers))
}
