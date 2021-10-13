import { ProfileType } from 'features/Profile/types'
import { usersAPI } from 'api'
import { ThunkType } from './types'

export const actions = {
  setSearch: (search: string) => ({ type: 'CONTACTS__SET_SEARCH', search } as const),
  setOtherProfile: (profile: ProfileType | null) => ({ type: 'CONTACTS__SET_OTHER_PROFILE', profile } as const)
}

export const getUser = (uid: string): ThunkType => async (dispatch, getState) => {
  dispatch(actions.setOtherProfile(null))
  const userProfile = await usersAPI.getUser(uid).catch((err) => console.log(err))
  if (userProfile) {
    dispatch(actions.setOtherProfile({ ...userProfile, uid }))
  }
}
