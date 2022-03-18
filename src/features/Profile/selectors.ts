import { createSelector } from 'reselect'
import moment from 'moment'
import { RootState } from 'common/types'
import { SLOT_DATE_FORMAT } from 'common/constants'
import { FormattedSlotsType } from 'features/Calendar/types'
import { range } from 'lodash'

const getMyProfileSelector = (state: RootState) => state.profile.profile

const getMyActiveRoleSelector = (state: RootState) => state.profile.profile?.activeRole

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

const getInvestmentsSelector = (state: RootState) => state.profile.profile?.investments

const getInvestorsSelector = (state: RootState) => state.profile.profile?.investors

export const getAllInvests = createSelector(
  getInvestmentsSelector,
  getInvestorsSelector,
  (investments, investors) => ({ ...investments, ...investors })
)

export const getDisplayNameSelector = (state: RootState) => state.profile.profile?.displayName
export const getFirstNameSelector = (state: RootState) => state.profile.profile?.first_name
export const getLastNameSelector = (state: RootState) => state.profile.profile?.last_name

export const getMyName = createSelector(getDisplayNameSelector, getFirstNameSelector, getLastNameSelector,
  (displayName, firstName, lastName) => displayName || `${firstName} ${lastName}`)

export const getMyProfile = createSelector(getMyProfileSelector, (profile) => profile)

export const getMyActiveRole = createSelector(getMyActiveRoleSelector, (activeRole) => activeRole)

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

export const getAllMySlots = createSelector(getSlotsMyProfileSelector, (slots) => {
  const endDate = moment().add(4, 'weeks')
  const timeZone = moment(new Date()).utcOffset()
  const formattedSlots: FormattedSlotsType = []

  if (slots) {
    Object.entries(slots).forEach(([parentDate, value]: any) => {
      const [slot] = parentDate.split(value.reccurent || 'Z')
      const dateSlot = moment(slot).add(timeZone, 'minutes')
      const formattedDateSlot = dateSlot.format(SLOT_DATE_FORMAT)
      switch (value.reccurent) {
        default:
        case 'Z': {
          if (!value?.disabled?.length && dateSlot.isBefore(endDate)) {
            formattedSlots.push({ ...value, date: formattedDateSlot, parentDate })
          }
          break
        }
        case 'D': {
          const diffDays = endDate.diff(dateSlot, 'days') + 1
          const amountOfRepetitions = Math.min(value.count || Infinity, diffDays)
          const counts = range(0, amountOfRepetitions).filter((count) => !value.disabled?.includes(count))
          const calculatedDates = counts.map((i) => moment(dateSlot).add(i, 'days'))
          formattedSlots.push(...(calculatedDates.map((date, reccurentIndex) => ({
            ...value, date: date.format(SLOT_DATE_FORMAT), reccurentIndex, parentDate
          }))))
          break
        }
        case 'W': {
          const diffWeeks = endDate.diff(dateSlot, 'weeks') + 1
          const amountOfRepetitions = Math.min(value.count || Infinity, diffWeeks)
          const counts = range(0, amountOfRepetitions).filter((count) => !value.disabled?.includes(count))
          const calculatedDates = counts.map((i) => moment(dateSlot).add(i, 'weeks'))
          formattedSlots.push(...(calculatedDates.map((date, reccurentIndex) => ({
            ...value, date: date.format(SLOT_DATE_FORMAT), reccurentIndex, parentDate
          }))))
          break
        }
      }
    })
  }
  return formattedSlots
})
