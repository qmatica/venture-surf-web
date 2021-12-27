import { createSelector } from 'reselect'
import moment from 'moment'
import { RootState } from 'common/types'
import { FormattedSlotsType } from 'features/Calendar/types'

const getMyProfileSelector = (state: RootState) => state.profile.profile

const getOtherProfileSelector = (state: RootState) => state.contacts.otherProfile

const getLoadersProfileSelector = (state: RootState) => state.profile.loaders

const getSlotsMyProfileSelector = (state: RootState) => state.profile.profile?.slots

const getLikedSelector = (state: RootState) => state.profile.profile?.liked

const getJobProfileSelector = (state: RootState) => {
  const { profile } = state.profile

  if (profile) {
    const { activeRole } = profile
    const { job } = profile[activeRole]

    if (job) {
      return {
        company: job.company,
        title: job.title,
        headline: job.headline,
        email: job.email,
        web: job.web,
        logoCompany: job.logoCompany
      }
    }
  }

  return null
}

export const getMyProfile = createSelector(getMyProfileSelector, (profile) => profile)

export const getLiked = createSelector(getLikedSelector, (liked) => liked)

export const getJob = createSelector(getJobProfileSelector, (job) => job)

export const getLoadersProfile = createSelector(getLoadersProfileSelector, (loaders) => loaders)

export const getProfile = createSelector(getOtherProfileSelector, getMyProfileSelector, (otherProfile, myProfile) => {
  if (otherProfile) return otherProfile
  return myProfile
})

export const getMySlots = createSelector(getSlotsMyProfileSelector, (slots) => {
  const formattedSlots: FormattedSlotsType = []

  if (slots) {
    Object.entries(slots).forEach(([date, value]) => {
      formattedSlots.push({
        date: moment(`${date
          .replace('Z', '')
          .replace('W', '')
          .replace('D1', '')
          .replace('D2', '')
          .replace('D', '')}Z`).format('YYYY-MM-DDTHH:mm:00'),
        ...value
      })
    })
  }
  return formattedSlots
})
