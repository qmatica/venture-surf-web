import { createSelector } from 'reselect'
import { RootState } from 'common/types'

const getMutualsSelector = (state: RootState) => state.profile.profile?.mutuals
const getSearch = (state: RootState) => state.contacts.search

export const getMutuals = createSelector(
  getMutualsSelector,
  getSearch,
  (mutuals, search) => mutuals
)
