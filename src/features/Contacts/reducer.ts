import { ProfileType } from 'features/Profile/types'
import { ActionTypes } from './types'

const initialState = {
  search: '',
  otherProfile: null as ProfileType | null,
  additionalProfiles: null as { [key: string]: ProfileType | null } | null,
  paramsPublicProfile: null as { uid: string, token: string } | null,
  isLoadingOtherProfile: false
}

export const ContactsReducer = (state = initialState, action: ActionTypes): typeof initialState => {
  switch (action.type) {
    case 'CONTACTS__SET_SEARCH':
      return {
        ...state,
        search: action.search
      }
    case 'CONTACTS__SET_PARAMS_PUBLIC_PROFILE':
      return {
        ...state,
        paramsPublicProfile: action.paramsPublicProfile
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
    case 'CONTACTS__SET_ADDITIONAL_PROFILES': {
      return {
        ...state,
        additionalProfiles: action.additionalProfiles
      }
    }
    default:
      return state
  }
}
