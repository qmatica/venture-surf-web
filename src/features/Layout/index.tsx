import React, { FC, ReactNode, useEffect } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from 'common/types'
import { Header } from 'features/Header'
import { Preloader } from 'common/components/Preloader'
import { Notifications } from 'features/Notifications'
import { Notifications as NotificationsVideoChat } from 'features/VideoChat/components/Notifications'
import { VideoChat } from 'features/VideoChat'
import styles from './styles.module.sass'
import { usersAPI } from '../../api'

interface ILayout {
    children: ReactNode
}

export const Layout: FC<ILayout> = ({ children }) => {
  const history = useHistory()
  const { initialized } = useSelector((state: RootState) => state.app)
  const { auth } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    checkPublicProfile()
  }, [])

  const checkPublicProfile = () => {
    const { pathname, search } = history.location
    const parts = pathname.split('/')
    if (parts[1] === 'profile' && parts[2]) {
      const uid = parts[2]
      if (search) {
        const [key, value] = search.replace('?', '').split('=')
        if (key === 'publicToken') {
          console.log('uid: ', uid)
          console.log('publicToken: ', value)
          usersAPI.getPublicProfile(uid, value)
        }
      }
    }
  }

  if (!initialized || auth === undefined) return <Preloader />

  if (auth === false) return <Redirect to="/auth" />

  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.wrapper} style={{ padding: '0 20px', marginBottom: '30px' }}>
        <div className={styles.container}>
          {children}
        </div>
      </div>
      <Notifications />
      <NotificationsVideoChat />
      <VideoChat />
    </div>
  )
}
