import React from 'react'
import { useSelector } from 'react-redux'
import { User } from 'features/User'
import { getSurfRecommendedUsers, getSurfUsers } from './selectors'
import styles from './styles.module.sass'

export const Surf = () => {
  const recommendedUsers = useSelector(getSurfRecommendedUsers)
  const users = useSelector(getSurfUsers)

  return (
    <div className={styles.container}>
      {recommendedUsers.length > 0 && (
        <div className={styles.recommendedUsersContainer}>
          {recommendedUsers.map((user) => (
            <User
              key={`${user.uid}-recommended`}
              user={user}
              rightSide="tags"
              viewVideos
              typeUser="surf"
              isRecommended
            />
          ))}
        </div>
      )}
      {users.map((user) => (
        <User
          key={user.uid}
          user={user}
          rightSide="tags"
          viewVideos
          typeUser="surf"
        />
      ))}
    </div>
  )
}
