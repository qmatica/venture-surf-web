import { ConfirmationResult, ApplicationVerifier } from '@firebase/auth-types'
import { actions as profileActions } from 'features/Profile/actions'
import { profileAPI } from 'api'
import { ThunkType } from './types'

export const actions = {
  setAuth: (auth: boolean) => ({ type: 'SIGN_IN__SET_AUTH', auth } as const),
  setConfirmation: (confirmation: ConfirmationResult) => ({ type: 'SIGN_IN__SET_CONFIRMATION', confirmation } as const),
  setIsFailedConfirmationCode: (isFailedConfirmationCode: boolean) => ({ type: 'SIGN_IN__SET_IS_FAILED_CONFIRMATION_CODE', isFailedConfirmationCode } as const),
  setIsLoading: (isLoading: boolean) => ({ type: 'SIGN_IN__SET_IS_LOADING', isLoading } as const),
  setReset: () => ({ type: 'SIGN_IN__SET_RESET' } as const)
}

export const signInWithPhoneNumber = (phoneNumber: string, applicationVerifier: ApplicationVerifier): ThunkType => async (dispatch, getState, getFirebase) => {
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
      dispatch(actions.setAuth(true))
      dispatch(actions.setIsLoading(false))
      const profile = await profileAPI.getProfile()
      dispatch(profileActions.setMyProfile(profile))
    })
    .catch((err) => {
      console.log('confirmCode failed:', err)
      dispatch(actions.setIsFailedConfirmationCode(true))
      dispatch(actions.setIsLoading(false))
    })
}
