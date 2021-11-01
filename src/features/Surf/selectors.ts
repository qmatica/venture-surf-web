import { createSelector } from 'reselect'
import { RootState } from 'common/types'

const getSurfUsersSelector = (state: RootState) => state.surf.users
const getSurfRecommendedUsersSelector = (state: RootState) => state.surf.recommendedUsers

export const getSurfUsers = createSelector(getSurfUsersSelector, (users) => users)

export const getSurfRecommendedUsers = createSelector(getSurfRecommendedUsersSelector, (users) => users)
