import { createSelector } from 'reselect'
import { RootState } from 'common/types'
import { UsersType } from 'features/Profile/types'

const getMutualsSelector = (state: RootState) => state.profile.profile?.mutuals
const getSearchSelector = (state: RootState) => state.contacts.search

export const getMutuals = createSelector(
  getMutualsSelector,
  getSearchSelector,
  (mutuals, search) => {
    if (!search) return mutuals ? Object.values(mutuals) : mutuals
    const lowerCaseSearch = search.toLowerCase()
    const filteredMutuals: UsersType = {}
    if (mutuals) {
      Object.keys(mutuals).forEach((key) => {
        if (mutuals[key].displayName?.toLowerCase().includes(lowerCaseSearch)
            || mutuals[key].name?.toLowerCase().includes(lowerCaseSearch)
            || mutuals[key].job?.company?.toLowerCase().includes(lowerCaseSearch)
            || mutuals[key].job?.title?.toLowerCase().includes(lowerCaseSearch)
            || mutuals[key].job?.headline?.toLowerCase().includes(lowerCaseSearch)
            || mutuals[key].job?.position?.toLowerCase().includes(lowerCaseSearch)
        ) {
          filteredMutuals[key] = mutuals[key]
        }
      })
    }
    return Object.values(filteredMutuals)
  }
)
