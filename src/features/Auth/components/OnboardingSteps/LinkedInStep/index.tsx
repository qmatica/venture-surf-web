import React, { FC } from 'react'
import { profileAPI } from 'api'
import { v4 as uuidv4 } from 'uuid'
import { OnboardingUserType } from 'features/Profile/types'
import { LinkedInIconSm, LinkedInAndVS } from 'common/icons'
import { linkedInAuthUrl } from 'features/Auth/constants'
import { getTokenFcm } from 'features/Profile/utils'
import { VOIP_TOKEN, BUNDLE } from 'common/constants'
import styles from './styles.module.sass'

interface ILinkedInStep {
  onboardingProfile?: OnboardingUserType
}

export const LinkedInStep: FC<ILinkedInStep> = ({
  onboardingProfile
}) => {
  const handleSignUp = async () => {
    localStorage.setItem('onboardingProfile', JSON.stringify(onboardingProfile))
    const deviceId = localStorage.getItem('deviceId') || uuidv4()
    localStorage.setItem('deviceId', deviceId)
    const fcmToken = await getTokenFcm()
    const device = {
      id: deviceId,
      os: window.navigator.appVersion,
      fcm_token: fcmToken,
      voip_token: VOIP_TOKEN,
      bundle: BUNDLE
    }

    await profileAPI.afterSignup({ ...onboardingProfile, device } as any)
    window.open(linkedInAuthUrl, '_self')
  }
  return (
    <div>
      <div className={styles.icon}><LinkedInAndVS /></div>
      <div className={styles.title}>Get verified by LinkedIn and autofill your profile</div>
      <button className={styles.button} onClick={handleSignUp}><LinkedInIconSm /> Sign in with LinkedIn</button>
    </div>
  )
}
