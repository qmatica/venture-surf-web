import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { User } from 'features/User'
import { getSent } from '../../selectors'
import styles from './styles.module.sass'

export const Sent: FC = () => {
  const sent = useSelector(getSent)
  return (
    <div className={styles.container}>
      {sent.map((user) => (
        <User
          key={user.uid}
          user={user}
        />
      ))}
    </div>
  )
}
