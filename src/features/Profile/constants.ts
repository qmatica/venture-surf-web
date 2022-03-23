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
  labelButton: {
    founder: '+ Add',
    investor: '+ Add'
  },
  requestButton: {
    founder: 'Approve that you invested in me',
    investor: 'I backed selected founders'
  },
  addButton: {
    founder: 'Add my investors',
    investor: 'Add my founders'
  },
  description: {
    founder: 'Label your investors. We will send them your request. If they approve, everyone will see who invested in you. This will add you some credits.',
    investor: 'We will send them your request. If they approve, everyone will see who you invested. This will add you some credits.'
  },
  header: {
    founder: 'You are not yet backed by',
    investor: 'You have no investments yet'
  },
  modalTitle: {
    founder: 'Get backed by',
    investor: 'Get investments'
  }
}

export const USER_RELATIONS = {
  MUTUALS: 'mutuals',
  SENT: 'sent',
  RECEIVED: 'received'
}

export const VIDEO_RECORDER = {
  PREPARE: 'Prepare',
  GO: 'Go'
}
