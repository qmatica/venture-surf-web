import React, { FC } from 'react'
import { OnboardingUserType } from 'features/Profile/types'

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
    window.open(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&scope=r_liteprofile&state=123456&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}`, '_self')
  }
  return (
    <div>
      <button onClick={prevStep}>prev</button>
      <div>Get verified by LinkedIn and autofill your profile</div>
      <button onClick={handleSignUp}>LinkedIn</button>
    </div>
  )
}
