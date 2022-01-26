import React, { FC, useState, useEffect } from 'react'
import cn from 'classnames'
import { OnboardingUserType, RoleType } from 'features/Profile/types'
import { stages, mapStagesWithIcons } from 'common/constants'
import { ROLES_STEPS, SELECTED_ROLES } from 'features/Auth/constants'
import { selectedStagesType } from 'features/Auth/types'
import commonStyles from 'features/Auth/components/OnboardingSteps/styles.module.sass'
import { ArrowNextIcon } from 'common/icons'
import logo from 'common/images/logo.jpg'
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

  useEffect(() => {
    if (!selectedRole) setIsAnySelected(false)
  }, [selectedRole])

  const handleRoleSelect = (role: RoleType) => {
    setOnboardingProfile({ roles: [role] } as OnboardingUserType)
    setSelectedRole(role)
    nextStep()
  }

  const handleOnSelect = (position: number) => {
    if (selectedRole) {
      const updatedStages = selectedStages[selectedRole].map((item, index) =>
        (index === position ? !item : item))

      const updatedRole: selectedStagesType = { ...initialSelectedRoles, [selectedRole]: updatedStages }
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
            {SELECTED_ROLES[selectedRole].title}
          </div>
          <div className={styles.description}>
            {SELECTED_ROLES[selectedRole].description}
          </div>
          {Object.entries(stages[selectedRole]).map(([key, value], index) => {
            const isSelected = selectedStages[selectedRole][index]
            return (
              <div
                className={cn(
                  styles.container,
                  isSelected && styles.selected
                )}
                key={key}
                onClick={() => handleOnSelect(index)}
              >
                <div className={cn(
                  commonStyles.iconBackground,
                  isSelected && commonStyles.iconBackgroundSelected
                )}
                >
                  {mapStagesWithIcons[value](isSelected && { stroke: '#FFFFFF' })}
                </div>
                {value}
              </div>
            )
          })}
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
        <>
          <div className={styles.title}>Choose you role</div>
          <img src={logo} alt="Venture Surf" draggable="false" />
          {ROLES_STEPS.map((item) => (
            <div
              key={item.role}
              className={styles.container}
              onClick={() => handleRoleSelect(item.role as RoleType)}
            >
              {mapStagesWithIcons[item.role]({})}
              {item.text}
              <div className={styles.arrowContainer}>
                <ArrowNextIcon />
              </div>
            </div>
          ))}
        </>
      )}
    </>
  )
}
