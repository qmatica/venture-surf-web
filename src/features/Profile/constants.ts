import { profileInteractionUsersType } from './types'

export const profileInteractionUsers: profileInteractionUsersType = {
  title: {
    founder: 'Backed by',
    investor: 'My investments'
  },
  content: {
    founder: 'investors',
    investor: 'investments'
  },
  buttonLabel: {
    founder: 'Label my investors',
    investor: 'Add investments'
  },
  requestButton: {
    founder: 'Approve that you invested in me',
    investor: 'I backed selected founders'
  }
}

export const USER_RELATIONS = {
  MUTUALS: 'mutuals',
  SENT: 'sent',
  RECEIVED: 'received'
}
