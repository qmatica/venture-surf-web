import { stagesType, selectedRoleType } from './types'

export const stages: stagesType = {
  investor: {
    1: 'First check',
    2: 'Angel rounds',
    3: 'Seed rounds',
    4: 'Series A+'
  },
  founder: {
    1: 'Pre-funding',
    2: 'Angel-backed',
    3: 'Venture-backed',
    4: 'Post Series A'
  }
}

export const industries = ['Bio / Healthcare', 'Consumer', 'Enterprise', 'Technology']

export const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&scope=r_liteprofile&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}`
export const accessTokenUrl = 'https://www.linkedin.com/uas/oauth2/accessToken'

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
