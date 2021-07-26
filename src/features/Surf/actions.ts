import { usersAPI } from 'api'
import { ThunkType } from './types'

export const actions = {
  setUsers: (users: any[]) => ({ type: 'SURF__SET_USERS', users } as const)
}

export const init = (): ThunkType => async (dispatch, getState) => {
  const { getMatches, getRecommended } = usersAPI
  const promise = await Promise.all([getMatches(), getRecommended()])
  const users = [...promise[0].matches, ...promise[1].recommendations]
  dispatch(actions.setUsers(users))
}
