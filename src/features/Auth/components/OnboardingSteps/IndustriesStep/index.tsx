import React, { FC, useState } from 'react'
import cn from 'classnames'
import { OnboardingUserType } from 'features/Profile/types'
import { industries, mapStagesWithIcons } from 'common/constants'
import commonStyles from 'features/Auth/components/OnboardingSteps/styles.module.sass'
import styles from './styles.module.sass'

interface IIndustriesStep {
  nextStep: () => void
  setOnboardingProfile: ({ industries }: OnboardingUserType) => void
  onboardingProfile?: OnboardingUserType
}

export const IndustriesStep: FC<IIndustriesStep> = ({
  nextStep, setOnboardingProfile, onboardingProfile
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<boolean[]>(new Array(industries.length).fill(false))
  const [isAnySelected, setIsAnySelected] = useState(false)

  const handleOnSelect = (position: number) => {
    const updatedIndustries = selectedIndustry.map((item, index) =>
      (index === position ? !item : item))

    setSelectedIndustry(updatedIndustries)
    setIsAnySelected(updatedIndustries.some((item) => item))
  }

  const handleNexStep = () => {
    const onboardingIndustries: string[] = []
    selectedIndustry.forEach((industry, index) => {
      if (industry) {
        onboardingIndustries.push(industries[index])
      }
    })
    setOnboardingProfile({ ...onboardingProfile, industries: onboardingIndustries } as OnboardingUserType)
    nextStep()
  }

  return (
    <div>
      <div className={styles.title}>Specify you niche</div>
      <div className={styles.description}>
        Choose your current state and then you could change it any time in your private settings
      </div>
      {industries.map((industry, index) => {
        const isSelected = selectedIndustry[index]
        return (
          <div
            key={industry}
            onClick={() => handleOnSelect(index)}
            className={cn(
              styles.container,
              selectedIndustry[index] && styles.selected
            )}
          >
            <div className={cn(
              commonStyles.iconBackground,
              isSelected && commonStyles.iconBackgroundSelected
            )}
            >
              {mapStagesWithIcons[industry](isSelected ? { stroke: '#FFFFFF' } : {})}
            </div>
            {industry}
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
  )
}
