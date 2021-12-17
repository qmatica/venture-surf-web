import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { User } from 'features/User'
import { getProfile } from 'features/Profile/selectors'
import { ProfileType } from 'features/Profile/types'
import { UserIcon } from 'common/icons'
import { Button } from 'common/components/Button'
import { getRequestedInvestments, getSurfRecommendedUsers, getSurfUsers } from './selectors'
import styles from './styles.module.sass'
import { acceptInvest, deleteInvest } from './actions'

export const Surf = () => {
  const dispatch = useDispatch()
  const [loaders, setLoaders] = useState<string[]>([])
  const profile = useSelector(getProfile) as ProfileType
  const recommendedUsers = useSelector(getSurfRecommendedUsers)
  const users = useSelector(getSurfUsers)
  const requestedInvestments = useSelector(getRequestedInvestments)

  const toggleLoader = (name: string) => {
    setLoaders((prevLoaders) => {
      if (prevLoaders.includes(name)) {
        return prevLoaders.filter((loader) => loader !== name)
      }
      return [...prevLoaders, name]
    })
  }

  const onAcceptInvest = (uid: string) => {
    toggleLoader(`onAcceptInvest-${uid}`)
    dispatch(acceptInvest(uid))
  }
  const onDeleteInvest = (uid: string) => {
    toggleLoader(`onDeleteInvest-${uid}`)
    dispatch(deleteInvest(uid))
  }

  return (
    <div className={styles.container}>
      {requestedInvestments && requestedInvestments.length > 0 && (
        <div className={styles.requestedInvestmentsContainer}>
          {requestedInvestments.map((inv) => {
            const user = profile.mutuals[inv.uid]

            if (!user) return null

            const name = user.name || user.displayName || `${user.first_name} ${user.last_name}`
            const { photoURL } = user

            return (
              <div className={styles.invContainer}>
                <div className={styles.userContainer}>
                  <div className={styles.photoContainer}>
                    {photoURL ? <img src={photoURL} alt={name} /> : <UserIcon />}
                  </div>
                  <div className={styles.textContainer}>
                    <div className={styles.name}>{name}</div>
                    <div className={styles.about}>added you to investments list</div>
                  </div>
                </div>
                <div className={styles.buttonsContainer}>
                  <Button
                    isLoading={loaders.includes(`onAcceptInvest-${inv.uid}`)}
                    title="Accept"
                    onClick={() => onAcceptInvest(inv.uid)}
                  />
                  <Button
                    isLoading={loaders.includes(`onDeleteInvest-${inv.uid}`)}
                    title="Decline"
                    onClick={() => onDeleteInvest(inv.uid)}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
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
