import React, { FC, ReactNode } from 'react'
import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from 'common/types'
import { Header } from 'features/Header'
import { Preloader } from 'common/components/Preloader'
import styles from './styles.module.sass'

interface ILayout {
    children: ReactNode
}

export const Layout: FC<ILayout> = ({ children }) => {
  const { initialized } = useSelector((state: RootState) => state.app)
  const { auth } = useSelector((state: RootState) => state.auth)
  const { profile } = useSelector((state: RootState) => state.profile)

  if (!initialized) return null

  if (auth && !profile) return <Preloader />

  if (!profile) return <Redirect to="/signin" />

  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.wrapper} style={{ padding: '0 20px' }}>
        <div className={styles.container}>
          {children}
        </div>
      </div>
    </div>
  )
}
