import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getMyProfile } from 'features/Profile/selectors'
import { getOnboardingProfile } from 'features/Auth/actions'
import { Preloader } from 'common/components/Preloader'
import { getAppInitialized } from 'common/selectors'

export const LinkedInCallback = () => {
  const initialized = useSelector(getAppInitialized)
  const profile = useSelector(getMyProfile)
  const dispatch = useDispatch()

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (code && initialized) dispatch(getOnboardingProfile(code))
  }, [initialized])

  if (profile) return <Redirect to="/surf" />
  return <Preloader />
}
