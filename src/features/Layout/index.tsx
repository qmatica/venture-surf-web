import React, { FC, ReactNode } from 'react'
import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from 'common/types'
import { Header } from 'features/Header'
import { Preloader } from 'common/components/Preloader'
import { Notifications } from 'features/Notifications'
import { Notifications as NotificationsVideoChat } from 'features/VideoChat/components/Notifications'
import { VideoChat } from 'features/VideoChat'
import styles from './styles.module.sass'

interface ILayout {
    children: ReactNode
}

export const Layout: FC<ILayout> = ({ children }) => {
  const { initialized } = useSelector((state: RootState) => state.app)
  const { auth } = useSelector((state: RootState) => state.auth)

  if (!initialized || auth === undefined) return <Preloader />

  if (auth === false) return <Redirect to="/signin" />

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
