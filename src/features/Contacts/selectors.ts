import { createSelector } from 'reselect'
import { RootState } from 'common/types'
import { MutualsType } from '../Profile/types'

const getMutualsSelector = (state: RootState) => state.profile.profile?.mutuals
const getSearchSelector = (state: RootState) => state.contacts.search

export const getMutuals = createSelector(
  getMutualsSelector,
  getSearchSelector,
  (mutuals, search) => {
    if (!search) return mutuals ? Object.values(mutuals) : mutuals
    const filteredMutuals: MutualsType = {}
    if (mutuals) {
      Object.keys(mutuals).forEach((key) => {
        if (mutuals[key].displayName?.includes(search)
            || mutuals[key].name?.includes(search)
            || mutuals[key].job?.company?.includes(search)
            || mutuals[key].job?.title?.includes(search)
            || mutuals[key].job?.headline?.includes(search)
            || mutuals[key].job?.position?.includes(search)
        ) {
          filteredMutuals[key] = mutuals[key]
        }
      })
    }
    return Object.values(filteredMutuals)
  }
)
