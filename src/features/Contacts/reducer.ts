import { ProfileType } from 'features/Profile/types'
import { ActionTypes } from './types'

const initialState = {
  search: '',
  selectedProfile: null as ProfileType | null
}

export const ContactsReducer = (state = initialState, action: ActionTypes): typeof initialState => {
  switch (action.type) {
    case 'CONTACTS__SET_SEARCH':
      return {
        ...state,
        search: action.search
      }
    case 'CONTACTS__SET_OTHER_PROFILE':
      return {
        ...state,
        selectedProfile: action.profile
      }
    default:
      return state
  }
}
