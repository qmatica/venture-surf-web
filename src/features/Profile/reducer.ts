import { ActionTypes, ProfileType } from './types'

const initialState = {
  profile: null as ProfileType | null,
  isActiveFcm: false,
  loaders: [] as string[],
  progressLoadingFile: null as number | null
}

export const ProfileReducer = (state = initialState, action: ActionTypes): typeof initialState => {
  switch (action.type) {
    case 'PROFILE__SET_MY_PROFILE':
      return { ...state, profile: action.profile }
    case 'PROFILE__SET_PROGRESS_FILE':
      return { ...state, progressLoadingFile: action.progressLoadingFile }
    case 'PROFILE__TOGGLE_LOADER': {
      let newLoaders: string[] = []

      if (state.loaders.includes(action.loader)) {
        newLoaders = state.loaders.filter((loader) => loader !== action.loader)
      } else {
        newLoaders = [...state.loaders, action.loader]
      }

      return {
        ...state,
        loaders: newLoaders
      }
    }
    case 'PROFILE__UPDATE_MY_CONTACTS': {
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.updatedUsers
        }
      }
    }
    case 'PROFILE__ADD_USER_IN_MY_CONTACTS': {
      if (!state.profile) return state

      return {
        ...state,
        profile: {
          ...state.profile,
          [action.payload.contacts]: {
            ...state.profile[action.payload.contacts],
            [action.payload.user.uid]: action.payload.user
          }
        }
      }
    }
    case 'PROFILE__REMOVE_USER_IN_MY_CONTACTS': {
      if (!state.profile) return state

      const users = { ...state.profile[action.payload.contacts] }
      delete users[action.payload.user.uid]

      return {
        ...state,
        profile: {
          ...state.profile,
          [action.payload.contacts]: users
        }
      }
    }
    case 'PROFILE__UPDATE_USER_IN_MY_CONTACTS': {
      if (!state.profile) return state

      return {
        ...state,
        profile: {
          ...state.profile,
          [action.payload.contacts]: {
            ...state.profile[action.payload.contacts],
            [action.payload.user.uid]: action.payload.user
          }
        }
      }
    }
    case 'PROFILE__SET_IS_ACTIVE_FCM':
      return {
        ...state,
        isActiveFcm: action.isActiveFcm
      }
    default: return state
  }
}
