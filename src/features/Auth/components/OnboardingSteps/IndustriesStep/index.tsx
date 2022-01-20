import React, { FC, useState } from 'react'
import { industries } from 'common/constants'
import { OnboardingUserType } from 'features/Profile/types'
import styles from './styles.module.sass'

interface IIndustriesStep {
    nextStep: () => void
    prevStep: () => void
    setOnboardingProfile: ({ industries }: OnboardingUserType) => void
    onboardingProfile?: OnboardingUserType
  }

export const IndustriesStep: FC<IIndustriesStep> = ({
  nextStep, prevStep, setOnboardingProfile, onboardingProfile
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<boolean[]>(new Array(industries.length).fill(false))

  const handleOnSelect = (position: number) => {
    const updatedIndustries = selectedIndustry.map((item, index) =>
      (index === position ? !item : item))

    setSelectedIndustry(updatedIndustries)
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
      <button onClick={prevStep}>Prev</button>
      <div>Specify you niche</div>
      {industries.map((industry, index) => (
        <div
          key={industry}
          onClick={() => handleOnSelect(index)}
          className={selectedIndustry[index] ? styles.selected : ''}
        >{industry}
        </div>
      ))}
      <button onClick={handleNexStep}>Next</button>
    </div>
  )
}
