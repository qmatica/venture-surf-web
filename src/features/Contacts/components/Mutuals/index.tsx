import { getMutuals } from 'features/Contacts/selectors'
import { User } from 'features/User'
import React, { FC, memo } from 'react'
import { useSelector } from 'react-redux'
import notFoundUsers from 'common/images/notFoundUsers.png'
import { parseUser } from 'features/Profile/utils'
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
      {mutuals.map((profile) => {
        const user = parseUser(profile)
        return (
          <User
            key={user.uid}
            user={user}
            rightSide="assets"
            viewActions
            switchRoles
            typeUser="mutuals"
          />
        )
      })}
    </div>
  )
})
