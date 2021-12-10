import { ProfileType } from 'features/Profile/types'
import { actions as profileActions } from 'features/Profile/actions'
import { actions as surfActions } from 'features/Surf/actions'
import { actions as actionsNotifications } from 'features/Notifications/actions'
import { usersAPI } from 'api'
import { apiCodes } from 'common/types'
import { addToClipboardPublicLinkProfile } from 'common/actions'
import { ThunkType } from './types'

export const actions = {
  setSearch: (search: string) => ({ type: 'CONTACTS__SET_SEARCH', search } as const),
  setOtherProfile: (otherProfile: ProfileType | null) => ({ type: 'CONTACTS__SET_OTHER_PROFILE', otherProfile } as const),
  setParamsPublicProfile: (paramsPublicProfile: { uid: string, token: string } | null) => (
    { type: 'CONTACTS__SET_PARAMS_PUBLIC_PROFILE', paramsPublicProfile } as const
  ),
  setIsLoadingOtherProfile: (isLoadingOtherProfile: boolean) => (
    { type: 'CONTACTS__SET_IS_LOADING_OTHER_PROFILE', isLoadingOtherProfile } as const
  )
}

export const getUser = (uid: string): ThunkType => async (dispatch) => {
  dispatch(actions.setIsLoadingOtherProfile(true))
  const userProfile = await usersAPI.getUser(uid).catch((err) => console.log(err))
  if (userProfile) {
    dispatch(actions.setOtherProfile({ ...userProfile, uid }))
  }
  dispatch(actions.setIsLoadingOtherProfile(false))
}

export const withdrawLike = (
  uid: string,
  isUserFromRecommended: boolean,
  action: 'withdrawLike' | 'like'
): ThunkType => async (dispatch, getState) => {
  const contacts = 'likes'
  const { profile } = getState().profile

  if (profile) {
    const updatedUser = {
      ...profile[contacts][uid],
      loading: [action]
    }
    dispatch(profileActions.updateUserInMyContacts(updatedUser, contacts))

    const status = await usersAPI[action](uid).catch((err) => {
      dispatch(actionsNotifications.addErrorMsg(JSON.stringify(err)))
    })

    if (status === apiCodes.success) {
      const updatedUser = {
        ...profile[contacts][uid],
        loading: [],
        clickedAction: `sent-${action}`
      }

      const surfAction = action === 'withdrawLike' ? 'addUser' : 'removeUser'

      dispatch(profileActions.updateUserInMyContacts(updatedUser, contacts))

      if (isUserFromRecommended) {
        dispatch(surfActions.updateRecommendedUser(updatedUser))
        return
      }
      // TODO: if user was in sent, he don't have all fields for surf. Need GET all available fields.
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
      dispatch(actionsNotifications.addErrorMsg(JSON.stringify(err)))
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

export const shareLinkProfile = (uid: string): ThunkType => async (dispatch, getState) => {
  const contacts = 'mutuals'
  const { profile } = getState().profile

  if (!profile) return

  const updatedUser = {
    ...profile[contacts][uid],
    loading: ['shareLinkProfile']
  }

  dispatch(profileActions.updateUserInMyContacts(updatedUser, contacts))

  dispatch(addToClipboardPublicLinkProfile(
    uid,
    () => dispatch(profileActions.updateUserInMyContacts({
      ...profile[contacts][uid],
      loading: []
    }, contacts))
  ))
}

export const getPublicProfile = (uid: string, token: string): ThunkType => async (dispatch, getState) => {
  const { profile } = getState().profile
  if (profile?.uid === uid) {
    dispatch(actions.setParamsPublicProfile(null))
    return
  }
  dispatch(actions.setIsLoadingOtherProfile(true))
  const publicProfile = await usersAPI.getPublicProfile(uid, token).catch((err) => {
    dispatch(actions.setIsLoadingOtherProfile(true))
    dispatch(actionsNotifications.addErrorMsg(JSON.stringify(err) || 'Error loading public profile ☹️'))
  })

  if (publicProfile) {
    if (profile?.uid !== publicProfile.uid) {
      // @ts-ignore
      dispatch(actions.setOtherProfile(publicProfile))
      dispatch(actions.setIsLoadingOtherProfile(false))
    }
  }
}
