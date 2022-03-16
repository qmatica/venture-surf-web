import { ActionTypes, ProfileType } from './types'
import { profileInteractionUsers } from './constants'

const initialState = {
  profile: null as ProfileType | null,
  isActiveFcm: false,
  isRegistration: null as Boolean | null,
  loaders: [] as string[],
  progressLoadingFile: null as number | null
}

export const ProfileReducer = (state = initialState, action: ActionTypes): typeof initialState => {
  switch (action.type) {
    case 'PROFILE__SET_MY_PROFILE':
      return { ...state, profile: action.profile, isRegistration: !action.profile }
    case 'PROFILE__SET_MY_PROFILE_LIKED': {
      return {
        ...state,
        profile: { ...state.profile, liked: { ...state.profile?.liked, ...action.liked } } as ProfileType
      }
    }
    case 'PROFILE__SET_MY_PROFILE_MUTUALS': {
      return {
        ...state,
        profile: { ...state.profile, mutuals: { ...state.profile?.mutuals, ...action.mutuals } } as ProfileType
      }
    }
    case 'PROFILE__UPDATE_MY_PROFILE_PHOTO':
      return { ...state, profile: { ...state.profile, photoURL: action.photoURL } as ProfileType }
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
    case 'PROFILE__ADD_CHAT_IN_MUTUAL': {
      if (!state.profile) return state

      return {
        ...state,
        profile: {
          ...state.profile,
          mutuals: {
            ...state.profile.mutuals,
            [action.payload.uid]: {
              ...state.profile.mutuals[action.payload.uid],
              chat: action.payload.chat
            }
          }
        }
      }
    }
    case 'PROFILE__SET_IS_ACTIVE_FCM':
      return {
        ...state,
        isActiveFcm: action.isActiveFcm
      }
    case 'PROFILE__UPDATE_MY_SLOTS': {
      if (!state.profile) return state
      let updatedSlots = { ...state.profile?.slots }

      if (action.payload.action === 'add') {
        if (updatedSlots) {
          if (typeof action.payload.slot !== 'string') {
            updatedSlots = {
              ...updatedSlots,
              ...action.payload.slot
            }
            return {
              ...state,
              profile: {
                ...state.profile,
                slots: updatedSlots
              }
            }
          }
        }
      }
      if (typeof action.payload.slot === 'string') {
        delete updatedSlots[action.payload.slot]
        return {
          ...state,
          profile: {
            ...state.profile,
            slots: updatedSlots
          }
        }
      }
      return state
    }
    case 'PROFILE__ACCEPT_INVEST': {
      const { profile } = state

      if (!profile) return state

      const list = profileInteractionUsers.content[profile.activeRole]
      const updatedInvestList = {
        ...profile[list],
        [action.uid]: {
          status: 'accepted'
        }
      }
      return {
        ...state,
        profile: {
          ...profile,
          [list]: updatedInvestList
        }
      }
    }
    case 'PROFILE__ADD_INVEST': {
      const { profile } = state

      if (!profile) return state

      const list = profileInteractionUsers.content[profile.activeRole]

      return {
        ...state,
        profile: {
          ...profile,
          [list]: action.investorList
        }
      }
    }
    case 'PROFILE__ADD_YOURSELF': {
      const { profile } = state
      const { uid, selectedRole } = action.payload

      if (!profile || !profile.uid) return state

      return {
        ...state,
        profile: {
          ...profile,
          mutuals: {
            ...profile.mutuals,
            [uid]: {
              ...profile.mutuals[uid],
              [selectedRole]: {
                ...profile.mutuals[uid][selectedRole],
                [profile.uid]: profile
              }
            }
          }
        }
      }
    }

    case 'PROFILE__DELETE_INVEST': {
      const { profile } = state

      if (!profile) return state

      const list = profileInteractionUsers.content[profile.activeRole]

      const updatedInvestList = { ...profile[list] }
      delete updatedInvestList[action.uid]

      return {
        ...state,
        profile: {
          ...profile,
          [list]: updatedInvestList
        }
      }
    }
    case 'PROFILE__ADD_INVESTMENT': {
      return {
        ...state,
        profile: {
          ...state.profile,
          investments: { ...state.profile?.investments, ...action.investment }
        } as ProfileType
      }
    }
    case 'PROFILE__ADD_INVESTOR': {
      return {
        ...state,
        profile: {
          ...state.profile,
          investors: { ...state.profile?.investors, ...action.investor }
        } as ProfileType
      }
    }
    default: return state
  }
}
