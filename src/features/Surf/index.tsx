import React from 'react'
import { useSelector } from 'react-redux'
import { getSurfUsers } from './selectors'
import styles from './styles.module.sass'
import { User } from './components/User'

export const Surf = () => {
  const users = useSelector(getSurfUsers)
  // job & content
  return (
    <div className={styles.container}>
      {users.map((user) => <User key={user.uid} user={user} />)}
    </div>
  )
}
