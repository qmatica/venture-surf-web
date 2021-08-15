import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'common/types'
import { Button } from 'common/components/Button'
import { VideoOffIcon, VideoOnIcon } from 'common/icons'
import styles from './styles.module.sass'

export const Notifications = () => {
  const { notifications } = useSelector((state: RootState) => state.videoChat)
  return (
    <div className={styles.container}>
      {notifications.map(({ user, actions }) => (
        <div className={styles.notificationContainer}>
          <div className={styles.userContainer}>
            <div className={styles.photoURL}>
              <img src={user.photoURL} alt={user.displayName} />
            </div>
            <div className={styles.infoContainer}>
              <div className={styles.displayName}>{user.displayName}</div>
              <div className={styles.typeNotification}>Incoming call</div>
            </div>
          </div>
          <div className={styles.buttonsContainer}>
            <Button
              title="Accept"
              icon={<VideoOnIcon />}
              className={styles.accept}
              onClick={actions.accept}
            />
            <Button
              title="Decline"
              icon={<VideoOffIcon />}
              className={styles.decline}
              onClick={actions.decline}
            />
          </div>
        </div>
      ))}
    </div>

  )
}
