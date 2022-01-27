import { selectedRoleType } from 'features/Auth/types'
import { CLIENT_ID, REDIRECT_URI } from 'common/constants'

export const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&scope=r_liteprofile&redirect_uri=${REDIRECT_URI}`

export const ONBOARDING_STEPS = {
  ROLE: 0,
  START_UP: 1,
  INDUSTRIES: 2,
  LINKEDIN: 3
}

export const ROLES_STEPS = [
  {
    role: 'investor',
    text: 'I am an investor'
  },
  {
    role: 'founder',
    text: 'I am a founder'
  }]

export const SELECTED_ROLES: selectedRoleType = {
  investor: { title: 'What stages are you', description: 'Choose one or several' },
  founder: { title: 'How big is your start-up?', description: 'Choose your current state and then you could change it any time in your private settings' }
}
