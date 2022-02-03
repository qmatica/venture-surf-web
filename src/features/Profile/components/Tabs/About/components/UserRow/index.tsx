import React, { FC } from 'react'
import { ProfileType } from 'features/Profile/types'
import { Link } from 'react-router-dom'
import { Image } from 'common/components/Image'
import { UserIcon, TrashCanIcon, CheckmarkIcon } from 'common/icons'
import cn from 'classnames'
import { determineJobWithoutActiveRole } from 'common/typeGuards'
import styles from './styles.module.sass'

interface IUserRow {
  profile: ProfileType
  uid: string
  status: string
  isSelected?: boolean
}

export const UserRow: FC<IUserRow> = ({
  profile, uid, status, isSelected
}) => {
  const user = profile.mutuals[uid]

  if (!user) return null

  const name = user.name || user.displayName || `${user.first_name} ${user.last_name}`
  const {
    photoURL, photoBase64, job, activeRole
  } = user

  const getJob = () => {
    if (!job || !Object.values(job).length) return null

    if (determineJobWithoutActiveRole(job)) {
      return (
        <>
          {job && (
            <div>
              {job.company && <div>{job.company}</div>}
              {job.title && <div>{job.title}</div>}
            </div>
          )}
        </>
      )
    }

    if (!activeRole || !job || !job[activeRole]) return null

    return (
      <>
        {job && (
          <div>
            {job[activeRole].company && <div>{job[activeRole].company}</div>}
            {job[activeRole].title && <div>{job[activeRole].title}</div>}
          </div>
        )}
      </>
    )
  }

  return (
    <div className={cn(styles.userContainer, isSelected && styles.selected)}>
      <Link to={`/profile/${uid}`}>
        <div className={cn(styles.photoContainer, isSelected && styles.selectedImage)}>
          <Image
            photoURL={photoURL}
            photoBase64={photoBase64}
            alt={name}
            userIcon={UserIcon}
          />
          {isSelected && <div className={styles.checkmark}><CheckmarkIcon /></div>}
        </div>
      </Link>
      <div>
        <Link to={`/profile/${uid}`}>
          <div className={styles.displayName}>{name}</div>
        </Link>
        <div className={styles.job}>
          {getJob()}
        </div>
      </div>
      <div className={styles.status}>{status}</div>
      <TrashCanIcon />
    </div>
  )
}
