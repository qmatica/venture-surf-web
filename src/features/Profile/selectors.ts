import { createSelector } from 'reselect'
import { RootState } from 'common/types'

const getMyProfileSelector = (state: RootState) => state.profile.profile
const getLoadersProfileSelector = (state: RootState) => state.profile.loaders

export const getMyProfile = createSelector(getMyProfileSelector, (profile) => profile)

export const getLoadersProfile = createSelector(getLoadersProfileSelector, (loaders) => loaders)
