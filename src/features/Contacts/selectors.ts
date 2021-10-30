import { createSelector } from 'reselect'
import { RootState } from 'common/types'
import { UsersType } from 'features/User/types'

const getSearchSelector = (state: RootState) => state.contacts.search

const getMutualsSelector = (state: RootState) => state.profile.profile?.mutuals

const getOtherProfileSelector = (state: RootState) => state.contacts.selectedProfile

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
        ) {
          filteredMutuals[key] = mutuals[key]
        }
      })
    }
    return Object.values(filteredMutuals)
  }
)

const getSentSelector = (state: RootState) => state.profile.profile?.likes

export const getSent = createSelector(
  getSentSelector,
  (sent) => (sent ? Object.values(sent) : [])
)

const getReceivedSelector = (state: RootState) => state.profile.profile?.liked

export const getReceived = createSelector(
  getReceivedSelector,
  (received) => (received ? Object.values(received) : [])
)

export const getOtherProfile = createSelector(getOtherProfileSelector, (profile) => profile)
