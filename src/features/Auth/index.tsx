import React, { useEffect } from 'react'
import logo from 'common/images/logo.jpg'
import firebase from 'firebase/compat'
import { useSelector } from 'react-redux'
import { RootState } from 'common/types'
import { Preloader } from 'common/components/Preloader'
import { SignIn } from './components/SignIn'
import styles from './styles.module.sass'

export const Auth = () => {
  const { isWaitingProfileData } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('captcha-container', {
      size: 'invisible',
      callback: (response: string) => {
        console.log('RecaptchaVerifier works!', response)
      }
    })
    window.recaptchaVerifier.render()
  }, [])

  if (isWaitingProfileData) return <Preloader />

  return (
    <div className={styles.wrapper}>
      <div className="g-recaptcha" id="captcha-container" />
      <div className={styles.logoContainer}>
        <div className={styles.logoTitle}>Welcome to</div>
        <img src={logo} alt="Venture Surf" draggable="false" />
      </div>
      <SignIn />
    </div>
  )
}
