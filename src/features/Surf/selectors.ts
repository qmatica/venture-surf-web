import { createSelector } from 'reselect'
import { RootState } from 'common/types'

const getSurfUsersSelector = (state: RootState) => state.surf.users
const getSurfRecommendedUsersSelector = (state: RootState) => state.surf.recommendedUsers
const getInvestmentsSelector = (state: RootState) => state.profile.profile?.investments

export const getSurfUsers = createSelector(getSurfUsersSelector, (users) => users)

export const getSurfRecommendedUsers = createSelector(getSurfRecommendedUsersSelector, (users) => users)

export const getRequestedInvestments = createSelector(
  getInvestmentsSelector,
  (investments) => {
    if (!investments) return null
    return Object.entries(investments)
      .filter(([uid, inv]) => inv.status === 'requested')
      .map(([uid, inv]) => ({
        uid,
        status: inv.status
      }))
  }
)
