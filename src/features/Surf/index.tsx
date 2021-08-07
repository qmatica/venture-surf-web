import React from 'react'
import { useSelector } from 'react-redux'
import { User } from 'features/User'
import { getSurfUsers } from './selectors'
import styles from './styles.module.sass'

export const Surf = () => {
  const users = useSelector(getSurfUsers)
  return (
    <div className={styles.container}>
      {users.map((user) => (
        <User
          key={user.uid}
          user={user}
          rightSide="tags"
          viewVideos
        />
      ))}
    </div>
  )
}
