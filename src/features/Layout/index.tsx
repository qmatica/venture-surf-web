import React, { FC, ReactNode } from 'react'
import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Header } from 'features/Header'
import { Preloader } from 'common/components/Preloader'
import { VideoChat } from 'features/VideoChat'
import { getAppInitialized } from 'common/selectors'
import { getAuth } from 'features/Auth/selectors'
import { getParamsPublicProfile } from 'features/Contacts/selectors'
import styles from './styles.module.sass'

interface ILayout {
    children: ReactNode
}

export const Layout: FC<ILayout> = ({ children }) => {
  const initialized = useSelector(getAppInitialized)
  const auth = useSelector(getAuth)
  const paramsPublicProfile = useSelector(getParamsPublicProfile)

  if (!initialized || auth === undefined) return <Preloader />

  if (auth === false && !paramsPublicProfile) return <Redirect to="/auth" />
  // test
  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.wrapper} style={{ padding: '0 20px', marginBottom: '30px' }}>
        <div className={styles.container}>
          {children}
        </div>
      </div>
      <VideoChat />
    </div>
  )
}
