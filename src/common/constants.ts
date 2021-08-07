import { stagesType } from './types'

export const stages: stagesType = {
  investor: {
    1: 'Pre-funding',
    2: 'Angel-backed',
    3: 'Venture-backed',
    4: 'Serias A',
    5: 'Post Serias A'
  },
  founder: {
    1: 'First Check',
    2: 'Angel rounds',
    3: 'Seed rounds',
    4: 'Series A',
    5: 'Series A+'
  }
}

export const industries = ['Bio / Healthcare', 'Consumer', 'Enterprise', 'Technology']
