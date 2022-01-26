import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { User } from 'features/User'
import { getProfile } from 'features/Profile/selectors'
import { ProfileType } from 'features/Profile/types'
import { UserPhotoIcon } from 'common/icons'
import { Image } from 'common/components/Image'
import { Button } from 'common/components/Button'
import { init as initSurf } from 'features/Surf/actions'
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

  useEffect(() => {
    if (!users)dispatch(initSurf())
  }, [])

  const toggleLoader = (name: string) => {
    setLoaders((prevLoaders) => {
      if (prevLoaders.includes(name)) {
        return prevLoaders.filter((loader) => loader !== name)
      }
      return [...prevLoaders, name]
    })
  }

  const onAcceptInvestor = (uid: string) => {
    toggleLoader(`onAcceptInvest-${uid}`)
    dispatch(acceptInvest(uid))
  }
  const onDeleteInvestor = (uid: string) => {
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
            // TODO: Remove photoURL usage, when photoBase64 comes from backend side.
            const { photoURL, photoBase64 } = user
            const list = `${profile.activeRole === 'founder' ? 'investments' : 'investors'} list`

            return (
              <div className={styles.invContainer} key={inv.uid}>
                <div className={styles.userContainer}>
                  <div className={styles.photoContainer}>
                    <Image
                      photoURL={photoURL}
                      photoBase64={photoBase64}
                      alt={name}
                      userIcon={UserPhotoIcon}
                    />
                  </div>
                  <div className={styles.textContainer}>
                    <div className={styles.name}>{name}</div>
                    <div className={styles.about}>added you to {list}</div>
                  </div>
                </div>
                <div className={styles.buttonsContainer}>
                  <Button
                    isLoading={loaders.includes(`onAcceptInvest-${inv.uid}`)}
                    title="Accept"
                    onClick={() => onAcceptInvestor(inv.uid)}
                  />
                  <Button
                    isLoading={loaders.includes(`onDeleteInvest-${inv.uid}`)}
                    title="Decline"
                    onClick={() => onDeleteInvestor(inv.uid)}
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
