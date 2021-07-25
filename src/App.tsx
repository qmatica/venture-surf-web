import React, { FC, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Profile } from 'features/Profile'
import { init } from 'common/actions'
import { SignIn } from 'features/Auth/components/SignIn'
import { Layout } from 'features/Layout'
import { Contacts } from 'features/Contacts'

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
            <Route path="/" exact render={() => <div>Empty page</div>} />
            <Route path="/profile" component={Profile} />
            <Route path="/contacts" component={Contacts} />
          </Layout>
        </Route>
      </Switch>
    </>
  )
}
