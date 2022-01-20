import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getMyProfile } from 'features/Profile/selectors'
import { getOnboardingProfile } from 'features/Auth/actions'
import { Preloader } from 'common/components/Preloader'

export const LinkedInCallback = () => {
  const profile = useSelector(getMyProfile)
  const dispatch = useDispatch()

  useEffect(() => {
    const url = window.location
    const token = new URLSearchParams(url.search).get('access_token')
    if (token) dispatch(getOnboardingProfile(token))
  }, [])

  // if (profile) return <Redirect to="/surf" />
  return <Preloader />
}
