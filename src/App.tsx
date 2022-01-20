import React, { FC, useEffect } from 'react'
import {
  Switch, Route, Redirect, useHistory
} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Auth } from 'features/Auth'
import { SignUp } from 'features/Auth/components/SignUp'
import { LinkedInCallback } from 'features/Auth/components/OnboardingSteps/LinkedInCallback'
import { Profile } from 'features/Profile'
import { init } from 'common/actions'
import { Layout } from 'features/Layout'
import { Contacts } from 'features/Contacts'
import { Surf } from 'features/Surf'
import { Calendar } from 'features/Calendar'
import { Conversations } from 'features/Conversations'
import { Notifications } from './features/Notifications'
import { Admin } from './features/Admin'

export const App: FC = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    dispatch(init(history))
  }, [])

  return (
    <>
      <Switch>
        <Route path="/auth" component={Auth} />
        <Route path="/sign_up" component={SignUp} />
        <Route path="/linkedin_callback" component={LinkedInCallback} />
        <Route path="/*">
          <Layout>
            <Route path="/" exact render={() => <Redirect to="/surf" />} />
            <Route path="/admin" component={Admin} />
            <Route path="/surf" component={Surf} />
            <Route path="/contacts" component={Contacts} />
            <Route path="/calendar" component={Calendar} />
            <Route path="/conversations" component={Conversations} />
            <Route path="/profile/:uid" component={Profile} />
          </Layout>
        </Route>
      </Switch>
      <Notifications />
    </>
  )
}
