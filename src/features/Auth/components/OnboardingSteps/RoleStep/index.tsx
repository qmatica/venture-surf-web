import React, { FC, useState } from 'react'
import { OnboardingUserType, RoleType } from 'features/Profile/types'
import { stages } from 'common/constants'
import { ROLES_STEPS, SELECTED_ROLES } from 'features/Auth/constants'
import { selectedStagesType } from 'features/Auth/types'
import cn from 'classnames'
import { ArrowBottomIcon } from 'common/icons'
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
  const initialSelectedRoles = {
    investor: new Array(Object.keys(stages.investor).length).fill(false),
    founder: new Array(Object.keys(stages.founder).length).fill(false)
  }
  const [selectedStages, setSelectedStages] = useState<selectedStagesType>(initialSelectedRoles)

  const [isAnySelected, setIsAnySelected] = useState(false)

  const handleRoleSelect = (role: RoleType) => {
    setOnboardingProfile({ roles: [role] } as OnboardingUserType)
    setSelectedRole(role)
    nextStep()
  }

  const handleOnSelect = (position: number) => {
    if (selectedRole) {
      const updatedStages = selectedStages[selectedRole].map((item, index) =>
        (index === position ? !item : item))

      const updatedRole = { [selectedRole]: updatedStages }
      setSelectedStages(updatedRole)
      setIsAnySelected(updatedRole[selectedRole].some((item) => item))
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
          <div className={styles.title}>
            {SELECTED_ROLES[selectedRole]}
          </div>
          {Object.entries(stages[selectedRole]).map(([key, value], index) => (
            <div
              className={cn(
                styles.container,
                selectedStages[selectedRole][index] && styles.selected
              )}
              key={key}
              onClick={() => handleOnSelect(index)}
            >
              {value}
            </div>
          ))}
          <button
            className={cn(
              styles.button,
              isAnySelected ? styles.show : styles.hidden
            )}
            onClick={handleNexStep}
          >Next
          </button>
        </div>
      ) : (
        <div>
          <div className={styles.title}>Choose you role</div>
          {ROLES_STEPS.map((item) => (
            <div
              key={item.role}
              className={styles.container}
              onClick={() => handleRoleSelect(item.role as RoleType)}
            >
              {item.text}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
