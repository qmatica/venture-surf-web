import React, { FC } from 'react'
import { signUpWithLinkedin } from 'features/Auth/actions'

interface ILinkedInStep {
    prevStep: () => void
  }

export const LinkedInStep: FC<ILinkedInStep> = ({ prevStep }) => (
  <div>
    <button onClick={prevStep}>prev</button>
    <div>Get verified by LinkedIn and autofill your profile</div>
    <button onClick={signUpWithLinkedin}>LinkedIn</button>
  </div>
)
