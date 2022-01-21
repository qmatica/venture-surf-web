import React, { FC } from 'react'
import { OnboardingUserType } from 'features/Profile/types'
import { linkedInAuthUrl } from 'common/constants'
import { ArrowBottomIcon } from 'common/icons'
import styles from './styles.module.sass'

interface ILinkedInStep {
  prevStep: () => void
  onboardingProfile?: OnboardingUserType
}

export const LinkedInStep: FC<ILinkedInStep> = ({
  prevStep,
  onboardingProfile
}) => {
  const handleSignUp = () => {
    localStorage.setItem('onboardingProfile', JSON.stringify(onboardingProfile))
    window.open(linkedInAuthUrl, '_self')
  }
  return (
    <div>
      <div className={styles.backIcon} onClick={prevStep}><ArrowBottomIcon /></div>
      <>
        <div className={styles.title}>Get verified by LinkedIn and autofill your profile</div>
        <button className={styles.button} onClick={handleSignUp}>Sign in with LinkedIn</button>
      </>
    </div>
  )
}
