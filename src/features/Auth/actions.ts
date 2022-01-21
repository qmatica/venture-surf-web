import { ConfirmationResult, ApplicationVerifier } from '@firebase/auth-types'
import { init as initProfile, actions as profileActions } from 'features/Profile/actions'
import { profileAPI, linkedInAPI } from 'api'
import { getTokenFcm } from 'features/Profile/utils'
import { init as initSurf } from '../Surf/actions'
import { ThunkType } from './types'

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
  setReset: () => ({ type: 'SIGN_IN__SET_RESET' } as const)
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

  const { confirmation } = getState().auth

  confirmation?.confirm(code)
    .then(async (res) => {
      console.log('confirmCode success. User:', res.user)
      dispatch(actions.setIsLoading(false))
      dispatch(actions.setIsWaitingProfileData(true))
      await Promise.all([dispatch(initProfile()), dispatch(initSurf())])
      dispatch(actions.setIsWaitingProfileData(false))
      dispatch(actions.setAuth(true))
    })
    .catch((err) => {
      console.log('confirmCode failed:', err)
      dispatch(actions.setIsFailedConfirmationCode(true))
      dispatch(actions.setIsLoading(false))
    })
}

export const getOnboardingProfile = (code: string): ThunkType => async (dispatch) => {
  const profileData = localStorage.getItem('onboardingProfile')
  const access_token = await linkedInAPI.createAccessToken(code)
  const response = await linkedInAPI.getMyProfileFromLinkedIn(access_token)

  if (profileData && response) {
    localStorage.removeItem('onboardingProfile')
    const deviceId = localStorage.getItem('deviceId')
    const fcm_token = await getTokenFcm()

    const device = {
      id: deviceId,
      os: window.navigator.appVersion,
      fcm_token,
      voip_token: '12428345723486-34639456-4563-4956',
      bundle: 'opentek.us.VentureSwipe'
    }

    const updatedProfile = {
      ...JSON.parse(profileData),
      ...response,
      device
    }
    const registeredProfile = await profileAPI.afterSignup(updatedProfile)
    dispatch(profileActions.setMyProfile(registeredProfile))
  }
}
