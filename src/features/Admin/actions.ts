import { adminAPI, usersAPI } from 'api'
import { executeAllPromises } from 'common/utils'
import { ThunkType } from './types'
import { actions as actionsNotifications } from '../Notifications/actions'

export const actions = {
  setIsAdminMode: (isAdmin: boolean) => ({ type: 'ADMIN__SET_IS_ADMIN_MODE', isAdmin } as const),
  setIsLoading: (isLoading: boolean) => ({ type: 'ADMIN__SET_IS_LOADING', isLoading } as const),
  setUsers: (users: any) => ({ type: 'ADMIN__SET_USERS', users } as const)
}

export const init = (): ThunkType => async (dispatch, getState) => {
  dispatch(actions.setIsLoading(true))
  const result = await adminAPI.getAllUsers()

  if (result) {
    dispatch(actions.setIsAdminMode(true))
    const { users } = result

    executeAllPromises(users.map((user: any) => usersAPI.getUser(user.uid))).then((items) => {
      const errors = items.errors.map((err) => err.error.replace('Profile for user ', '').replace(' not found!', ''))
      const { results } = items

      console.log(`— ${items.results.length} Promises were successful: `, results)
      console.log(`— ${items.errors.length} Promises failed: `, errors)

      const mergedUsers = users.map((user: any) => {
        const foundedUser = results.find(({ uid }) => uid === user.uid)
        if (foundedUser) {
          return {
            ...user,
            props: foundedUser
          }
        }
        if (errors.includes(user.uid)) {
          return {
            ...user,
            props: { withError: true }
          }
        }
        return user
      })

      dispatch(actions.setUsers(mergedUsers))
      dispatch(actions.setIsLoading(false))
    })
  }
}

export const deleteUser = (uid: string):ThunkType => async (dispatch, getState) => {
  const result = await adminAPI.deleteUser(uid).catch((err) => {
    dispatch(actionsNotifications.addErrorMsg(JSON.stringify(err)))
  })

  if (result.status === 'user deleted!') {
    const { users } = getState().admin
    const updatedUsers = [...users]
    const foundedIndexUser = users.findIndex((user) => user.uid === uid)
    if (foundedIndexUser) {
      updatedUsers.splice(foundedIndexUser, 1)
      dispatch(actions.setUsers(updatedUsers))
    }
  }
}
