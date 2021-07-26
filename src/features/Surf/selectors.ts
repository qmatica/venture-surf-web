import { createSelector } from 'reselect'
import { RootState } from 'common/types'

const getSurfUsersSelector = (state: RootState) => state.surf.users

export const getSurfUsers = createSelector(getSurfUsersSelector, (users) => users)
