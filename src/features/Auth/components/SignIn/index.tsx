import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import firebase from 'firebase/compat/app'
import { PreloaderIcon } from 'common/icons'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { RootState } from 'common/types'
import { Redirect } from 'react-router-dom'
import { getMyProfile } from 'features/Profile/selectors'
import styles from './styles.module.sass'
import { actions, confirmCode, signInWithPhoneNumber } from '../../actions'

declare global {
  interface Window {
    recaptchaVerifier: firebase.auth.RecaptchaVerifier
  }
}

export const SignIn = () => {
  const dispatch = useDispatch()
  const codeInputRef = useRef<HTMLInputElement>(null)

  const {
    auth, confirmation, isLoading, isFailedConfirmationCode
  } = useSelector((state: RootState) => state.auth)
  const profile = useSelector(getMyProfile)

  const [phoneNumber, setPhoneNumber] = useState('')
  const [confirmationCode, setConfirmationCode] = useState<string>('')

  useEffect(() => {
    if (confirmationCode.length === 6) dispatch(confirmCode(confirmationCode))

    if (isFailedConfirmationCode && confirmationCode.length > 0) {
      dispatch(actions.setIsFailedConfirmationCode(false))
    }
  }, [confirmationCode])

  useEffect(() => {
    if (isFailedConfirmationCode) setConfirmationCode('')
  }, [isFailedConfirmationCode])

  const signIn = () => {
    dispatch(signInWithPhoneNumber(`+${phoneNumber}`, window.recaptchaVerifier))
  }

  if (auth) {
    if (!profile) return <Redirect to="/sign_up" />
    return <Redirect to="/surf" />
  }

  useEffect(() => {
    if (codeInputRef.current && confirmation) codeInputRef.current.focus()
  }, [confirmation])

  return (
    <div>
      {!confirmation ? (
        <>
          <div className={styles.phoneNumberContainer}>
            <PhoneInput
              inputProps={{
                name: 'phoneNumber',
                required: true,
                autoFocus: true
              }}
              placeholder="Enter your phone number"
              disableDropdown
              autocompleteSearch={false}
              value={phoneNumber}
              onChange={(phone) => setPhoneNumber(phone)}
            />
          </div>
          <div className={styles.buttonContainer}>
            <button type="button" disabled={!phoneNumber.length} onClick={signIn}>
              {isLoading ? <PreloaderIcon /> : 'continue'}
            </button>
          </div>
        </>
      ) : (
        <>
          <input
            type="text"
            ref={codeInputRef}
            className={`${styles.input} ${styles.confirmCode}`}
            value={confirmationCode}
            onChange={({ target: { value } }) => setConfirmationCode(value.trim())}
            placeholder="Enter your code"
            maxLength={6}
          />
          {isFailedConfirmationCode && (
          <div className={styles.isFailedConfirmationCode}>Invalid confirmation code</div>
          )}
          <div className={styles.buttonContainer}>
            {isLoading ? <PreloaderIcon stroke="#1557FF" /> : <div className={styles.resendCode}>Resend code</div>}
          </div>
        </>
      )}
    </div>
  )
}
