import React, { FC } from 'react'
import { useDispatch } from 'react-redux'
import { ProfileType } from 'features/Profile/types'
import { Link } from 'react-router-dom'
import { Image } from 'common/components/Image'
import { UserIcon, TrashCanIcon, CheckmarkIcon } from 'common/icons'
import cn from 'classnames'
import { determineJobWithoutActiveRole } from 'common/typeGuards'
import { deleteInvest } from 'features/Surf/actions'
import styles from './styles.module.sass'

interface IUserRow {
  profile: ProfileType
  uid: string
  status?: string
  isSelected?: boolean
  isBacked?: boolean
}

export const UserRow: FC<IUserRow> = ({
  profile, uid, status, isSelected, isBacked
}) => {
  const dispatch = useDispatch()
  const user = profile.mutuals[uid]

  if (!user) return null

  const name = user.name || user.displayName || `${user.first_name} ${user.last_name}`
  const {
    photoURL, photoBase64, job, activeRole
  } = user

  const onDelete = (uid: string) => {
    dispatch(deleteInvest(uid))
  }

  const getJob = () => {
    if (!job) return null

    if (determineJobWithoutActiveRole(job)) {
      return (
        <div>
          {job.company && <div>{job.company}</div>}
          {job.title && <div>{job.title}</div>}
        </div>
      )
    }

    if (!activeRole || !job[activeRole]) return null

    const { company, title } = job[activeRole]

    return (
      <div>
        {company && <div>{company}</div>}
        {title && <div>{title}</div>}
      </div>
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
        {isBacked ? (
          <Link to={`/profile/${uid}`}>
            <div className={styles.displayName}>{name}</div>
          </Link>
        ) : <div className={styles.displayName}>{name}</div>}
        <div className={styles.job}>
          {getJob()}
        </div>
      </div>
      <div className={styles.status}>{status}</div>
      {isBacked && status === 'waiting' && (<div className={styles.trashIcon} onClick={() => onDelete(uid)}><TrashCanIcon /></div>)}
    </div>
  )
}
