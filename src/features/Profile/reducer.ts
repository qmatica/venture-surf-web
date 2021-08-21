import { ActionTypes, ProfileType } from './types'

const initialState = {
  profile: null as ProfileType | null,
  progressLoadingFile: null as number | null
}

export const ProfileReducer = (state = initialState, action: ActionTypes): typeof initialState => {
  switch (action.type) {
    case 'PROFILE__SET_MY_PROFILE':
      return { ...state, profile: action.profile }
    case 'PROFILE__SET_PROGRESS_FILE':
      return { ...state, progressLoadingFile: action.progressLoadingFile }
    case 'PROFILE__UPDATE_MY_CONTACTS': {
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.updatedUsers
        }
      }
    }
    default: return state
  }
}
