import { ProfileType } from 'features/Profile/types'
import { actions as profileActions } from 'features/Profile/actions'
import { actions as surfActions } from 'features/Surf/actions'
import { actions as notificationsActions } from 'features/Notifications/actions'
import { usersAPI } from 'api'
import { apiCodes } from 'common/types'
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

export const withdrawLike = (uid: string, action: 'withdrawLike' | 'like'): ThunkType => async (dispatch, getState) => {
  const contacts = 'likes'
  const { profile } = getState().profile

  if (profile) {
    const updatedUser = {
      ...profile[contacts][uid],
      loading: [action]
    }
    dispatch(profileActions.updateUserInMyContacts(updatedUser, contacts))

    const status = await usersAPI[action](uid).catch((err) => {
      dispatch(notificationsActions.addErrorMsg(err))
    })

    if (status === apiCodes.success) {
      const updatedUser = {
        ...profile[contacts][uid],
        loading: [],
        clickedAction: `sent-${action}`
      }

      const surfAction = action === 'withdrawLike' ? 'addUser' : 'removeUser'

      // TODO: if user was in sent, he don't have all fields for surf. Need GET all available fields.

      dispatch(profileActions.updateUserInMyContacts(updatedUser, contacts))
      dispatch(surfActions[surfAction](updatedUser))
    }
  }
}

export const accept = (uid: string): ThunkType => async (dispatch, getState) => {
  const contacts = 'liked'
  const { profile } = getState().profile

  if (profile) {
    const updatedUser = {
      ...profile[contacts][uid],
      loading: ['accept']
    }
    dispatch(profileActions.updateUserInMyContacts(updatedUser, contacts))

    const status = await usersAPI.like(uid).catch((err) => {
      dispatch(notificationsActions.addErrorMsg(err))
    })

    if (status === apiCodes.success) {
      const updatedUser = {
        ...profile[contacts][uid],
        loading: []
      }

      dispatch(profileActions.removeUserInMyContacts(updatedUser, contacts))
      dispatch(profileActions.addUserInMyContacts(updatedUser, 'mutuals'))
    }
  }
}
