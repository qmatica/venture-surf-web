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
export const LINKEDIN_CALLBACK = '/linkedin_callback'
export const REDIRECT_URI = `${window.location.origin}${LINKEDIN_CALLBACK}`

export const LOCAL_STORAGE_VALUES = {
  NOTIFY_BEFORE_MEETINGS: 'notifyBeforeMeetings',
  SCHEDULED_MEETINGS: 'scheduledMeetingsToNotify',
  SEPARATOR: '_'
}

export const SETTINGS_MODAL = {
  ALLOW_UNSCHEDULED_CALLS: 'Allow unscheduled voice calls from my network',
  UPDATES_FROM_PEOPLE: 'Updates from people follow',
  NOTIFY_BEFORE_MEETINGS: '5 minutes to the next meeting',
  VISIBLE_FOUNDER_PROFILE: 'Founder profile visible in Surf',
  VISIBLE_INVESTOR_PROFILE: 'Investor profile visible in Surf',
  EXPERIMENTAL_FEATURES: 'Experimental features',
  REQUESTS_TO_CONNECT: 'Requests to connect',
  DELETE_ALL_DATA: 'Delete all data',
  NOTIFICATIONS: 'Notifications',
  LOG_OUT: 'Log out',
  HOW_OTHERS_SEE: 'How others see your profile'
}

export const DELETE_ALL_DATA_MODAL = {
  TITLE: 'Delete all data',
  BODY: 'Your account, personal data, PDF files, connections and appointments will be deleted.',
  WARNING: 'This cannot be undone.',
  CONFIRMATION: 'Are you sure?',
  CANCEL: 'Cancel',
  DELETE: 'Delete'
}

export const NOTIFICATION_TYPES = {
  CALL_INSTANT: 'call_instant',
  CALL_INSTANT_GROUP: 'call_instant_group',
  CALL_DECLINED: 'call_declined',
  CALL_FINISHED: 'call_finished',
  LIKE: 'like',
  MUTUAL_LIKE: 'mutual_like',
  INVEST: 'invest',
  INTRO: 'intro',
  INTRO_YOU: 'intro_you',
  SHARE: 'share',
  CALL_SCHEDULED: 'call_scheduled',
  CALL_CANCELED: 'call_canceled'
}

export const BROWSER_PERMISSIONS = {
  GRANTED: 'granted'
}

export const SLOT_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:00'
