import React, { FC, useState } from 'react'
import { OnboardingUserType } from 'features/Profile/types'
import { stages } from 'common/constants'
import { selectedStagesType } from 'common/types'
import styles from './styles.module.sass'

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
  const [selectedStages, setSelectedStages] = useState<selectedStagesType>({
    investor: new Array(Object.keys(stages.investor).length).fill(false),
    founder: new Array(Object.keys(stages.founder).length).fill(false)
  })

  const handleRoleSelect = (role: 'investor' | 'founder') => {
    setOnboardingProfile({ roles: [role] } as OnboardingUserType)
    setSelectedRole(role)
  }

  const handleOnSelect = (position: number) => {
    if (selectedRole) {
      const updatedStages = selectedStages[selectedRole].map((item, index) =>
        (index === position ? !item : item))

      setSelectedStages({ [selectedRole]: updatedStages })
    }
  }

  const handleNexStep = () => {
    if (selectedRole) {
      const stages: number[] = []
      selectedStages[selectedRole].forEach((currentStage, index) => {
        if (currentStage) {
          stages.push(index + 1)
        }
      })
      setOnboardingProfile({ ...onboardingProfile, stages } as OnboardingUserType)
      nextStep()
    }
  }

  return (
    <>
      {selectedRole ? (
        <div>
          <button onClick={() => setSelectedRole(null)}>Prev</button>
          <div>
            {selectedRole === 'investor'
              ? 'How big is your start-up?'
              : 'What stages are you'}
          </div>
          {Object.entries(stages[selectedRole]).map(([key, value], index) => (
            <div
              className={selectedStages[selectedRole][index] && styles.selected}
              key={key}
              onClick={() => handleOnSelect(index)}
            >
              {value}
            </div>
          ))}
          <button onClick={handleNexStep}>Next</button>
        </div>
      ) : (
        <div>
          <div>Choose you role</div>
          <div onClick={() => handleRoleSelect('investor')}>
            I am an Investor
          </div>
          <div onClick={() => handleRoleSelect('founder')}>I am a founder</div>
        </div>
      )}
    </>
  )
}
