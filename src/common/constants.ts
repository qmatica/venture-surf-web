import React from 'react'
import {
  FirstCheckIcon,
  AngelRoundsIcon,
  SeedRoundsIcon,
  SeriesAPlusIcon,
  BioIcon,
  ConsumerIcon,
  EnterpriseIcon,
  TechnologyIcon,
  PreFoundingIcon,
  AngelBackedIcon,
  VentureBackedIcon,
  PostSeriesAIcon,
  InvestorIcon,
  FounderIcon
} from 'common/icons'
import { stagesType } from './types'

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

export const mapStagesWithIcons: { [key: string]: React.FC<{stroke?: string}> } = {
  'First check': FirstCheckIcon,
  'Angel rounds': AngelRoundsIcon,
  'Seed rounds': SeedRoundsIcon,
  'Series A+': SeriesAPlusIcon,
  'Pre-funding': PreFoundingIcon,
  'Angel-backed': AngelBackedIcon,
  'Venture-backed': VentureBackedIcon,
  'Post Series A': PostSeriesAIcon,
  'Bio / Healthcare': BioIcon,
  Consumer: ConsumerIcon,
  Enterprise: EnterpriseIcon,
  Technology: TechnologyIcon,
  investor: InvestorIcon,
  founder: FounderIcon
}

export const industries = ['Bio / Healthcare', 'Consumer', 'Enterprise', 'Technology']

export const VOIP_TOKEN = '12428345723486-34639456-4563-4956'
export const BUNDLE = 'opentek.us.VentureSwipe'

export const CLIENT_ID = '862iqtc4nxrbtq'
export const CLIENT_SECRET = '4XeDtFnJQ3e0PCDo'
export const REDIRECT_URI = `${window.location.origin}${process.env.REACT_APP_REDIRECT_URI}`
