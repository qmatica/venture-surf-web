import { ConfirmationResult, ApplicationVerifier } from '@firebase/auth-types'
import { init as initProfile } from 'features/Profile/actions'
import { init as initSurf } from '../Surf/actions'
import { ThunkType } from './types'

export const actions = {
  setAuth: (auth: boolean) => ({ type: 'SIGN_IN__SET_AUTH', auth } as const),
  setConfirmation: (confirmation: ConfirmationResult) => ({ type: 'SIGN_IN__SET_CONFIRMATION', confirmation } as const),
  setIsFailedConfirmationCode: (isFailedConfirmationCode: boolean) => ({ type: 'SIGN_IN__SET_IS_FAILED_CONFIRMATION_CODE', isFailedConfirmationCode } as const),
  setIsLoading: (isLoading: boolean) => ({ type: 'SIGN_IN__SET_IS_LOADING', isLoading } as const),
  setIsWaitingProfileData: (isWaitingProfileData: boolean) => ({ type: 'SIGN_IN_SET_IS_WAITING_PROFILE_DATA', isWaitingProfileData } as const),
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
