import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { getMyProfile } from 'features/Profile/selectors'
import { getAuth } from 'features/Auth/selectors'
import { OnboardingUserType } from 'features/Profile/types'
import { ONBOARDING_STEPS } from 'common/constants'
import { LinkedInStep } from '../OnboardingSteps/LinkedInStep'
import { RoleStep } from '../OnboardingSteps/RoleStep'
import { IndustriesStep } from '../OnboardingSteps/IndustriesStep'
import styles from './styles.module.sass'

export const SignUp = () => {
  const profile = useSelector(getMyProfile)
  const auth = useSelector(getAuth)
  const [currentStep, setCurrentStep] = useState(1)
  const nextStep = () => setCurrentStep(currentStep + 1)
  const prevStep = () => setCurrentStep(currentStep - 1)
  const [onboardingProfile, setOnboardingProfile] = useState<OnboardingUserType>()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const { ROLE, INDUSTRIES, LINKEDIN } = ONBOARDING_STEPS

  const onboardingSteps = () => {
    switch (currentStep) {
      case ROLE:
        return (
          <RoleStep
            nextStep={nextStep}
            setOnboardingProfile={setOnboardingProfile}
            onboardingProfile={onboardingProfile}
            setSelectedRole={setSelectedRole}
            selectedRole={selectedRole}
          />
        )
      case INDUSTRIES:
        return (
          <IndustriesStep
            nextStep={nextStep}
            prevStep={prevStep}
            setOnboardingProfile={setOnboardingProfile}
            onboardingProfile={onboardingProfile}
          />
        )
      case LINKEDIN:
        return <LinkedInStep prevStep={prevStep} onboardingProfile={onboardingProfile} />
      default:
        return null
    }
  }

  if (profile) return <Redirect to="/surf" />

  if (!auth) return <Redirect to="/auth" />

  return <div className={styles.wrapper}>{onboardingSteps()}</div>
}
