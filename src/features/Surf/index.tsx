import React from 'react'
import { useSelector } from 'react-redux'
import { getSurfUsers } from './selectors'
import styles from './styles.module.sass'

export const Surf = () => {
  const users = useSelector(getSurfUsers)
  // job & content
  return (
    <div>
      <div>Surf</div>
      <div>{users.map((user) => {
        const name = user.displayName || `${user.first_name} ${user.last_name}`
        return (
          <div key={user.uid}>
            <div>
              <img src={user.photoURL} alt={name} width={150} />
            </div>
            <div>{name}</div>
            <div>{user.stages}</div>
            <div>{user.industries}</div>
            <div>{user.tags}</div>
            <div>{user.activeRole}</div>
          </div>
        )
      })}
      </div>
    </div>
  )
}
