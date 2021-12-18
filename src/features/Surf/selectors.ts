import { createSelector } from 'reselect'
import { RootState } from 'common/types'
import { profileInteractionUsers } from 'features/Profile/constants'

const getSurfUsersSelector = (state: RootState) => state.surf.users
const getSurfRecommendedUsersSelector = (state: RootState) => state.surf.recommendedUsers
const getInvestmentsSelector = (state: RootState) => {
  const { profile } = state.profile
  if (!profile) return null
  return profile[profileInteractionUsers.content[profile.activeRole]]
}

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
