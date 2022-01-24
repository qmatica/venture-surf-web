import { selectedRoleType } from 'features/Auth/types'

export const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&scope=r_liteprofile&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}`

export const ONBOARDING_STEPS = {
  ROLE: 0,
  START_UP: 1,
  INDUSTRIES: 2,
  LINKEDIN: 3
}

export const ROLES_STEPS = [
  {
    role: 'investor',
    text: 'I am an Investor'
  },
  {
    role: 'founder',
    text: 'I am a founder'
  }]

export const SELECTED_ROLES: selectedRoleType = {
  investor: 'How big is your start-up?',
  founder: 'What stages are you'
}
