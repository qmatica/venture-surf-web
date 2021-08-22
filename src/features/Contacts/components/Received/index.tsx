import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { User } from 'features/User'
import { getReceived } from '../../selectors'
import styles from './styles.module.sass'

export const Received: FC = () => {
  const received = useSelector(getReceived)

  return (
    <div className={styles.container}>
      {received.map((user) => (
        <User
          key={user.uid}
          user={user}
        />
      ))}
    </div>
  )
}
