import React, { FC } from 'react'

interface IIndustriesStep {
    nextStep: () => void
    prevStep: () => void
  }

export const IndustriesStep: FC<IIndustriesStep> = ({ nextStep, prevStep }) => (
  <div>
    <button onClick={prevStep}>Prev</button>
    <div>Specify you niche</div>
    <button onClick={nextStep}>Next</button>
  </div>
)
