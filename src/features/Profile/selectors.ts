import { createSelector } from 'reselect'
import { RootState } from 'common/types'

const getMyProfileSelector = (state: RootState) => state.profile.profile

export const getMyProfile = createSelector(getMyProfileSelector, (profile) => profile)
