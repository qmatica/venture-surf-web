import { ConfirmationResult, ApplicationVerifier } from '@firebase/auth-types'
import { init as initProfile, actions as profileActions } from 'features/Profile/actions'
import { profileAPI, usersAPI } from 'api'
import { getTokenFcm } from 'features/Profile/utils'
import { VOIP_TOKEN, BUNDLE, REDIRECT_URI } from 'common/constants'
import { init as initSurf } from '../Surf/actions'
import { ThunkType } from './types'
import { actions as actionsNotifications } from '../Notifications/actions'

export const actions = {
  setAuth: (auth: boolean) => ({ type: 'SIGN_IN__SET_AUTH', auth } as const),
  setConfirmation: (confirmation: ConfirmationResult) => (
    { type: 'SIGN_IN__SET_CONFIRMATION', confirmation } as const
  ),
  setIsFailedConfirmationCode: (isFailedConfirmationCode: boolean) => (
    { type: 'SIGN_IN__SET_IS_FAILED_CONFIRMATION_CODE', isFailedConfirmationCode } as const
  ),
  setIsLoading: (isLoading: boolean) => ({ type: 'SIGN_IN__SET_IS_LOADING', isLoading } as const),
  setIsWaitingProfileData: (isWaitingProfileData: boolean) => (
    { type: 'SIGN_IN_SET_IS_WAITING_PROFILE_DATA', isWaitingProfileData } as const
  ),
  setReset: () => ({ type: 'SIGN_IN__SET_RESET' } as const),
  logout: () => ({ type: 'LOG_OUT' } as const),
  deleteUser: (uid: string) => ({ type: 'DELETE_USER' } as const)
}

export const signInWithPhoneNumber = (phoneNumber: string, applicationVerifier: ApplicationVerifier): ThunkType =>
  async (dispatch, getState, getFirebase) => {
    dispatch(actions.setIsLoading(true))

    getFirebase().auth().signInWithPhoneNumber(phoneNumber, applicationVerifier)
      .then((confirmation) => {
        console.log('signInWithPhoneNumber success:', confirmation)
        dispatch(actions.setConfirmation(confirmation))
        dispatch(actions.setIsLoading(false))
      })
      .catch((err) => {
        console.log('signInWithPhoneNumber failed:', err)
        dispatch(actions.setIsLoading(false))
      })
  }

export const confirmCode = (code: string): ThunkType => async (dispatch, getState) => {
  dispatch(actions.setIsLoading(true))

  const { auth: { confirmation } } = getState()

  confirmation?.confirm(code)
    .then(async (res) => {
      console.log('confirmCode success. User:', res.user)
      dispatch(actions.setIsLoading(false))
      dispatch(actions.setIsWaitingProfileData(true))
      await dispatch(initProfile())
      await dispatch(initSurf())
      dispatch(actions.setIsWaitingProfileData(false))
      dispatch(actions.setAuth(true))
    })
    .catch((err) => {
      if (err.status === 400) {
        dispatch(actions.setAuth(true))
      }
      dispatch(actions.setIsFailedConfirmationCode(true))
      dispatch(actions.setIsLoading(false))
    })
}

export const getOnboardingProfile = (code: string): ThunkType => async (dispatch) => {
  const profileData = localStorage.getItem('onboardingProfile')
  const access_token = await profileAPI.getLinkedinToken(code, REDIRECT_URI)
  const response = await profileAPI.getLinkedinProfile(access_token)

  if (profileData && response) {
    localStorage.removeItem('onboardingProfile')
    const deviceId = localStorage.getItem('deviceId')
    const fcmToken = await getTokenFcm()
    if (deviceId) {
      const device = {
        id: deviceId,
        os: window.navigator.appVersion,
        fcm_token: fcmToken,
        voip_token: VOIP_TOKEN,
        bundle: BUNDLE
      }

      await profileAPI.updateMyProfile({
        displayName: `${response.localizedFirstName} ${response.localizedLastName}`,
        first_name: response.localizedFirstName,
        last_name: response.localizedLastName,
        linkedIn_ID: response.id
      })
      const registeredProfile = await profileAPI.afterLogin(device)
      dispatch(profileActions.setMyProfile(registeredProfile))
    }
  }
}

export const signOut = (): ThunkType =>
  async (dispatch, getState, getFirebase) => {
    dispatch(actions.setIsLoading(true))
    const deviceId = localStorage.getItem('deviceId')
    if (deviceId) {
      await profileAPI.forgetDevice(deviceId)
    }

    getFirebase().auth().signOut()
      .then(() => {
        dispatch(actions.logout())
        localStorage.clear()
        dispatch(actions.setIsLoading(false))
      })
      .catch((err) => {
        console.log('signOut failed:', err)
        dispatch(actions.setIsLoading(false))
      })
  }

export const deleteMyUser = (uid: string): ThunkType => async (dispatch, getState, getFirebase) => {
  getFirebase().auth().signOut()
    .then(() => {
      dispatch(actions.setIsLoading(true))
      dispatch(actions.logout())
      localStorage.clear()
    })

  await usersAPI.deleteUser(uid).catch((err) => {
    dispatch(actionsNotifications.addErrorMsg(JSON.stringify(err)))
  })
}
