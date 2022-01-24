import React, { FC } from 'react'
import cn from 'classnames'
import { OnboardingUserType } from 'features/Profile/types'
import { LinkedInIconSm, LinkedInAndVS } from 'common/icons'
import { linkedInAuthUrl } from 'features/Auth/constants'
import styles from './styles.module.sass'

interface ILinkedInStep {
  onboardingProfile?: OnboardingUserType
}

export const LinkedInStep: FC<ILinkedInStep> = ({
  onboardingProfile
}) => {
  const handleSignUp = () => {
    localStorage.setItem('onboardingProfile', JSON.stringify(onboardingProfile))
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
