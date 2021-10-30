import React, { FC, useEffect } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Auth } from 'features/Auth'
import { Profile } from 'features/Profile'
import { init } from 'common/actions'
import { Layout } from 'features/Layout'
import { Contacts } from 'features/Contacts'
import { Surf } from 'features/Surf'
import { Calendar } from 'features/Calendar'
import { Conversations } from 'features/Conversations'

export const App: FC = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(init())
  }, [])

  return (
    <>
      <Switch>
        <Route path="/auth" component={Auth} />
        <Route path="/*">
          <Layout>
            <Route path="/" exact render={() => <Redirect to="/surf" />} />
            <Route path="/surf" component={Surf} />
            <Route path="/contacts" component={Contacts} />
            <Route path="/calendar" component={Calendar} />
            <Route path="/conversations" component={Conversations} />
            <Route path="/profile/:uid" component={Profile} />
          </Layout>
        </Route>
      </Switch>
    </>
  )
}
