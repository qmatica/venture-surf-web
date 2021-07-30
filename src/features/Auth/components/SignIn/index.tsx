import React, { useEffect, useRef, useState } from 'react'
import logo from 'common/images/logo.jpg'
import { useDispatch, useSelector } from 'react-redux'
import firebase from 'firebase/app'
import { PreloaderIcon } from 'common/icons'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { RootState } from 'common/types'
import { Redirect } from 'react-router-dom'
import { Preloader } from 'common/components/Preloader'
import styles from './styles.module.sass'
import { actions, confirmCode, signInWithPhoneNumber } from '../../actions'

declare global {
  interface Window {
    recaptchaVerifier: firebase.auth.RecaptchaVerifier
  }
}

export const SignIn = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const {
    auth, confirmation, isLoading, isFailedConfirmationCode, isWaitingProfileData
  } = useSelector((state: RootState) => state.auth)
  const [confirmationCode, setConfirmationCode] = useState<string>('')
  const codeInputRef = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()

  useEffect(() => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('captcha-container', {
      size: 'invisible',
      callback: (response: string) => {
        console.log('RecaptchaVerifier works!', response)
      }
    })
    window.recaptchaVerifier.render()
  }, [])

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

  if (isWaitingProfileData) return <Preloader />

  if (auth) return <Redirect to="/surf" />

  return (
    <div className={styles.wrapper}>
      <div className="g-recaptcha" id="captcha-container" />
      <div>
        <div className={styles.logoContainer}>
          <div className={styles.logoTitle}>Welcome to</div>
          <img src={logo} alt="Venture Surf" draggable="false" />
        </div>
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
    </div>
  )
}
