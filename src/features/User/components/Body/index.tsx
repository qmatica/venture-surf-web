import React, { FC } from 'react'
import { Button } from 'common/components/Button'
import { UserPhotoIcon } from 'common/icons'
import { Link } from 'react-router-dom'
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

  const emptyJob = job && Object.values(job).every((value) => value === '')

  return (
    <div className={styles.container}>
      <Link to={`/profile/${user.uid}`}>
        <div className={styles.imgContainer}>
          {photoURL ? <img src={photoURL} alt="" /> : <UserPhotoIcon />}
        </div>
      </Link>
      <div className={styles.infoContainer}>
        <Link to={`/profile/${user.uid}`}>
          <div className={styles.name}>
            {name}
          </div>
        </Link>
        {job && !emptyJob && (
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
                key={action.title}
                title={action.title}
                isLoading={action.isLoading}
                onClick={action.onClick}
                icon={action.icon && <action.icon />}
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
