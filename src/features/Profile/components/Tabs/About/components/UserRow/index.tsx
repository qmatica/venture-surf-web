import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLoadersProfile } from 'features/Profile/selectors'
import { ProfileType } from 'features/Profile/types'
import { Link } from 'react-router-dom'
import { Image } from 'common/components/Image'
import {
  UserIcon, TrashCanIcon, CheckmarkIcon, PreloaderIcon, AcceptIcon
} from 'common/icons'
import cn from 'classnames'
import { determineJobWithoutActiveRole } from 'common/typeGuards'
import { deleteInvest, acceptInvest } from 'features/Surf/actions'
import styles from './styles.module.sass'

interface IUserRow {
  profile: ProfileType
  uid: string
  status?: string
  isSelected?: boolean
  isBacked?: boolean
  isEdit?: boolean
}

export const UserRow: FC<IUserRow> = ({
  profile, uid, status, isSelected, isBacked, isEdit
}) => {
  const dispatch = useDispatch()
  const loaders = useSelector(getLoadersProfile)
  const user = profile.mutuals[uid]

  if (!user) return null

  const name = user.name || user.displayName || `${user.first_name} ${user.last_name}`
  const {
    photoURL, photoBase64, job, activeRole
  } = user

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
      <div className={cn(styles.photoContainer, isSelected && styles.selectedImage)}>
        <Link to={`/profile/${uid}`} onClick={(e) => !isBacked && e.preventDefault()}>
          <Image
            photoURL={photoURL}
            photoBase64={photoBase64}
            alt={name}
            userIcon={UserIcon}
          />
        </Link>
        {isSelected && <div className={styles.checkmark}><CheckmarkIcon /></div>}
      </div>
      <div>
        <Link to={`/profile/${uid}`} onClick={(e) => !isBacked && e.preventDefault()}>
          <div className={styles.displayName}>{name}</div>
        </Link>
        <div className={styles.job}>
          {getJob()}
        </div>
      </div>
      <div className={styles.status}>{status}</div>
      {isEdit && isBacked && (
      <>
        {status === 'requested' && (
        <div className={styles.icon} onClick={() => dispatch(acceptInvest(uid))}>
          {loaders.includes(`${uid}-acceptInvest`) ? <PreloaderIcon stroke="#96baf6" /> : <AcceptIcon stroke="#96baf6" />}
        </div>
        )}
        {status !== 'accepted' && (
        <div className={styles.icon} onClick={() => dispatch(deleteInvest(uid))}>
          {loaders.includes(`${uid}-deleteInvest`) ? <PreloaderIcon stroke="#96baf6" /> : <TrashCanIcon />}
        </div>
        )}
      </>
      )}
    </div>
  )
}
