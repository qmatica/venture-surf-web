import { getMutuals } from 'features/Contacts/selectors'
import { User } from 'features/User'
import React, { FC, memo } from 'react'
import { useSelector } from 'react-redux'
import notFoundUsers from 'common/images/notFoundUsers.png'
import styles from './styles.module.sass'

export const Mutuals: FC = memo(() => {
  const mutuals = useSelector(getMutuals)

  if (!mutuals?.length) {
    return (
      <div className={styles.containerNotFoundUsers}>
        <img src={notFoundUsers} alt="Not found users" />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {mutuals.map((user) => (
        <User
          key={user.uid}
          user={user}
          rightSide="assets"
          viewActions
        />
      ))}
    </div>
  )
})
