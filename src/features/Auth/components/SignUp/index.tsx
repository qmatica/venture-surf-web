import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { getMyProfile } from 'features/Profile/selectors'
import { getAuth } from 'features/Auth/selectors'
import { OnboardingUserType } from 'features/Profile/types'
import { ArrowNextIcon } from 'common/icons'
import { ONBOARDING_STEPS } from 'features/Auth/constants'
import { LinkedInStep } from '../OnboardingSteps/LinkedInStep'
import { RoleStep } from '../OnboardingSteps/RoleStep'
import { IndustriesStep } from '../OnboardingSteps/IndustriesStep'
import styles from './styles.module.sass'

export const SignUp = () => {
  const profile = useSelector(getMyProfile)
  const auth = useSelector(getAuth)
  const [currentStep, setCurrentStep] = useState(0)
  const nextStep = () => setCurrentStep(currentStep + 1)
  const prevStep = () => setCurrentStep(currentStep - 1)
  const [onboardingProfile, setOnboardingProfile] = useState<OnboardingUserType>()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const {
    ROLE, START_UP, INDUSTRIES, LINKEDIN
  } = ONBOARDING_STEPS

  const onboardingSteps = useMemo(() => {
    switch (currentStep) {
      case ROLE:
      case START_UP:
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
            setOnboardingProfile={setOnboardingProfile}
            onboardingProfile={onboardingProfile}
          />
        )
      case LINKEDIN:
        return <LinkedInStep onboardingProfile={onboardingProfile} />
      default:
        return null
    }
  }, [currentStep, onboardingProfile, selectedRole])

  if (profile) return <Redirect to="/surf" />

  if (!auth) return <Redirect to="/auth" />

  return (
    <div className={styles.wrapper}>
      {currentStep > 0 && (
        <div
          className={styles.backIcon}
          onClick={() => {
            if (currentStep === START_UP) setSelectedRole(null)
            prevStep()
          }}
        >
          <ArrowNextIcon />
        </div>
      )}
      {onboardingSteps}
    </div>
  )
}
