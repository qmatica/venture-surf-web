import React, { FC, useState } from 'react'
import { OnboardingUserType } from 'features/Profile/types'
import { industries, stages } from 'common/constants'

interface IRoleStep {
  nextStep: () => void
  setSelectedRole: (role: string | null) => void
  selectedRole: string | null
  setOnboardingProfile: ({ roles, stages }: OnboardingUserType) => void
  onboardingProfile?: OnboardingUserType
}

export const RoleStep: FC<IRoleStep> = ({
  nextStep,
  setSelectedRole,
  selectedRole,
  setOnboardingProfile,
  onboardingProfile
}) => {
  const handleRoleSelect = (role: 'investor' | 'founder') => {
    setOnboardingProfile({ roles: [role] } as OnboardingUserType)
    setSelectedRole(role)
  }

  return (
    <>
      {!selectedRole ? (
        <div>
          <div>Choose you role</div>
          <div onClick={() => handleRoleSelect('investor')}>
            I am an Investor
          </div>
          <div onClick={() => handleRoleSelect('founder')}>I am a founder</div>
        </div>
      ) : (
        <div>
          <button onClick={() => setSelectedRole(null)}>Prev</button>
          <div>
            {selectedRole === 'investor'
              ? 'How big is your start-up?'
              : 'What stages are you'}
          </div>
          {Object.entries(stages[selectedRole]).map(([key, value]) => (
            <div
              key={key}
            >
              {value}
            </div>
          ))}
          <button onClick={nextStep}>Next</button>
        </div>
      )}
    </>
  )
}
