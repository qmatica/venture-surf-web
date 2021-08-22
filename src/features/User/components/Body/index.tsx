import React, { FC } from 'react'
import { Button } from 'common/components/Button'
import styles from './styles.module.sass'
import { UserType } from '../../types'
import { EnumActionsUser } from '../../constants'

interface IBody {
    user: UserType
    rightSide?: React.ReactElement
}

export const Body: FC<IBody> = ({
  user,
  rightSide
}) => {
  const name = user.name || user.displayName || `${user.first_name} ${user.last_name}`

  const { photoURL, job } = user

  const actions = Object.values(user.actions).filter((action) => action.type === EnumActionsUser.dynamic)

  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        {photoURL && <img src={photoURL} alt={name} />}
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.name}>
          {name}
        </div>
        {job && Object.keys(job).length > 0 && (
        <div className={styles.jobContainer}>
          {job.company && <div className={styles.company}>{job.company}</div>}
          {job.title && <div className={styles.title}>{job.title}</div>}
          {job.headline && <div className={styles.headline}>{job.headline}</div>}
          {job.position && <div className={styles.position}>{job.position}</div>}
        </div>
        )}
        {actions.length > 0 && (
        <div className={styles.buttonsContainer}>
          {actions.map((action) => {
            if (!action.isActive) return null
            return (
              <Button
                title={action.title}
                isLoading={action.isLoading}
                onClick={action.onClick}
              />
            )
          })}
        </div>
        )}
      </div>
      <div className={styles.rightSide}>
        {rightSide}
      </div>
    </div>
  )
}
