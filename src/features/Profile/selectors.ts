import { createSelector } from 'reselect'
import { RootState } from 'common/types'

const getProfileSelector = (state: RootState) => state.profile.profile

export const getProfile = createSelector(getProfileSelector, (profile) => profile)
