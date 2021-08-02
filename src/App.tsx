import React, { FC, useEffect } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Profile } from 'features/Profile'
import { init } from 'common/actions'
import { SignIn } from 'features/Auth/components/SignIn'
import { Layout } from 'features/Layout'
import { Contacts } from 'features/Contacts'
import { Surf } from 'features/Surf'
import { Calendar } from 'features/Calendar'

export const App: FC = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(init())
  }, [])

  return (
    <>
      <Switch>
        <Route path="/signin" component={SignIn} />
        <Route path="/*">
          <Layout>
            <Route path="/" exact render={() => <Redirect to="/surf" />} />
            <Route path="/surf" component={Surf} />
            <Route path="/contacts" component={Contacts} />
            <Route path="/calendar" component={Calendar} />
            <Route path="/profile" component={Profile} />
          </Layout>
        </Route>
      </Switch>
    </>
  )
}
