import { createSelector } from 'reselect'
import moment from 'moment'
import { RootState } from 'common/types'
import { FormattedSlotsType } from 'features/Calendar/types'

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
    Object.entries(slots).forEach(([date, value]: any) => {
      const [slot] = date.split(value.reccurent)
      const dateSlot = moment(slot).add(timeZone, 'minutes')
      const formattedDateSlot = dateSlot.format('YYYY-MM-DDTHH:mm:00')
      switch (value.reccurent) {
        default:
        case 'Z': {
          if (!value?.disabled?.length && dateSlot.isBefore(endDate)) {
            formattedSlots.push({ ...value, date: formattedDateSlot })
          }
          break
        }
        case 'D': {
          const counts = Array(value.count).fill(0).filter((_, i) => !value.disabled.includes(i))
          const calculatedDates = counts.map((_, i) => moment(dateSlot).add(i, 'days'))
          // TODO: add disabled value, correct type and optimize
          formattedSlots.push(...(calculatedDates.filter((date) => date.isBefore(endDate)).map((date) => ({ date: date.format('YYYY-MM-DDTHH:mm:00') })) as any))
          break
        }
        case 'W': {
          const counts = Array(value.count).fill(0).filter((_, i) => !value.disabled.includes(i))
          const calculatedDates: any = counts.map((_, i) => moment(dateSlot).add(i, 'weeks'))
          // TODO: add disabled value, correct type and optimize
          formattedSlots.push(...(calculatedDates.filter((date: any) => date.isBefore(endDate)).map((date: any) => ({ date: date.format('YYYY-MM-DDTHH:mm:00') })) as any))
          break
        }
      }
    })
  }
  return formattedSlots
})
