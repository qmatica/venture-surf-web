import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { getMyProfile } from 'features/Profile/selectors'
import { OnboardingUserType } from 'features/Profile/types'
import { LinkedInStep } from '../OnboardingSteps/LinkedInStep'
import { RoleStep } from '../OnboardingSteps/RoleStep'
import { IndustriesStep } from '../OnboardingSteps/IndustriesStep'
import styles from './styles.module.sass'

export const SignUp = () => {
  const profile = useSelector(getMyProfile)
  // if (profile) return <Redirect to="/surf" />
  const [currentStep, setCurrentStep] = useState(1)
  const nextStep = () => setCurrentStep(currentStep + 1)
  const prevStep = () => setCurrentStep(currentStep - 1)
  const [onboardingProfile, setOnboardingProfile] = useState<OnboardingUserType>()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const onboardingSteps = () => {
    switch (currentStep) {
      case 1:
        return (
          <RoleStep
            nextStep={nextStep}
            setOnboardingProfile={setOnboardingProfile}
            onboardingProfile={onboardingProfile}
            setSelectedRole={setSelectedRole}
            selectedRole={selectedRole}
          />
        )
      case 2:
        return <IndustriesStep nextStep={nextStep} prevStep={prevStep} />
      case 3:
        return <LinkedInStep prevStep={prevStep} />
      default:
        return null
    }
  }

  return <div className={styles.wrapper}>{onboardingSteps()}</div>
}
