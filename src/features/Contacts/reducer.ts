import { ProfileType } from 'features/Profile/types'
import { ActionTypes } from './types'

const initialState = {
  search: '',
  selectedProfile: null as ProfileType | null,
  isViewPublicProfile: false,
  isLoadingPublicProfile: false
}

export const ContactsReducer = (state = initialState, action: ActionTypes): typeof initialState => {
  switch (action.type) {
    case 'CONTACTS__SET_SEARCH':
      return {
        ...state,
        search: action.search
      }
    case 'CONTACTS__SET_IS_VIEW_PUBLIC_PROFILE':
      return {
        ...state,
        isViewPublicProfile: action.isViewPublicProfile
      }
    case 'CONTACTS__SET_OTHER_PROFILE':
      return {
        ...state,
        selectedProfile: action.profile
      }
    case 'CONTACTS__SET_IS_LOADING_PUBLIC_PROFILE':
      return {
        ...state,
        isLoadingPublicProfile: action.isLoadingPublicProfile
      }
    default:
      return state
  }
}
