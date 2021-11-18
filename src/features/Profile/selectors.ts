import { createSelector } from 'reselect'
import { RootState } from 'common/types'

const getMyProfileSelector = (state: RootState) => state.profile.profile

const getOtherProfileSelector = (state: RootState) => state.contacts.otherProfile

const getLoadersProfileSelector = (state: RootState) => state.profile.loaders

const getSlotsMyProfileSelector = (state: RootState) => state.profile.profile?.slots

export const getMyProfile = createSelector(getMyProfileSelector, (profile) => profile)

export const getLoadersProfile = createSelector(getLoadersProfileSelector, (loaders) => loaders)

export const getProfile = createSelector(getOtherProfileSelector, getMyProfileSelector, (otherProfile, myProfile) => {
  if (otherProfile) return otherProfile
  return myProfile
})

export const getMySlots = createSelector(getSlotsMyProfileSelector, (slots) => slots)
