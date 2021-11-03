import { ProfileType } from 'features/Profile/types'
import { ActionTypes } from './types'

const initialState = {
  search: '',
  otherProfile: null as ProfileType | null,
  isPublicProfile: false,
  isLoadingOtherProfile: false
}

export const ContactsReducer = (state = initialState, action: ActionTypes): typeof initialState => {
  switch (action.type) {
    case 'CONTACTS__SET_SEARCH':
      return {
        ...state,
        search: action.search
      }
    case 'CONTACTS__SET_IS_PUBLIC_PROFILE':
      return {
        ...state,
        isPublicProfile: action.isPublicProfile
      }
    case 'CONTACTS__SET_OTHER_PROFILE':
      return {
        ...state,
        otherProfile: action.otherProfile
      }
    case 'CONTACTS__SET_IS_LOADING_OTHER_PROFILE':
      return {
        ...state,
        isLoadingOtherProfile: action.isLoadingOtherProfile
      }
    default:
      return state
  }
}
