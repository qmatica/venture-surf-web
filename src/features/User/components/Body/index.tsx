import React, { FC } from 'react'
import { like } from 'features/Surf/actions'
import { accept, withdrawLike } from 'features/Contacts/actions'
import { Button } from 'common/components/Button'
import { UserPhotoIcon } from 'common/icons'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { determineJobWithoutActiveRole } from 'common/typeGuards'
import styles from './styles.module.sass'
import { UserType } from '../../types'

interface IBody {
    user: UserType
    rightSide?: React.ReactElement
    typeUser: 'mutuals' | 'received' | 'sent' | 'surf'
    isRecommended: boolean
}

export const Body: FC<IBody> = ({
  user,
  rightSide,
  typeUser,
  isRecommended
}) => {
  const dispatch = useDispatch()

  const name = user.name || user.displayName || `${user.first_name} ${user.last_name}`

  const {
    uid, photoURL, job, loading, clickedAction, activeRole
  } = user

  const getButtons = () => {
    switch (typeUser) {
      case 'surf': {
        const isCLicked = clickedAction === 'surf-like'

        const onClick = () => {
          dispatch(like(uid, isRecommended, isCLicked ? 'withdrawLike' : 'like'))
        }

        return (
          <Button
            title={isCLicked ? 'Withdraw like' : 'Like'}
            isLoading={loading?.some((el) => ['like', 'withdrawLike'].includes(el))}
            onClick={onClick}
            icon={isCLicked ? 'withdrawLike' : 'like'}
          />
        )
      }
      case 'sent': {
        const isCLicked = clickedAction === 'sent-withdrawLike'

        const isUserFromRecommended = !!(user.recommendedByList)

        const onClick = () => {
          dispatch(withdrawLike(uid, isUserFromRecommended, isCLicked ? 'like' : 'withdrawLike'))
        }

        return (
          <Button
            title={isCLicked ? 'Like' : 'Withdraw like'}
            isLoading={loading?.some((el) => ['withdrawLike', 'like'].includes(el))}
            onClick={onClick}
            icon={isCLicked ? 'like' : 'withdrawLike'}
          />
        )
      }
      case 'received': {
        const onClickAccept = () => {
          dispatch(accept(user.uid))
        }
        const onClickIgnore = () => {}

        return (
          <>
            <Button
              title="Accept"
              isLoading={loading?.includes('accept')}
              onClick={onClickAccept}
              icon="like"
            />
            <Button
              title="Ignore"
              isLoading={loading?.includes('ignore')}
              onClick={onClickIgnore}
              icon="withdrawLike"
            />
          </>
        )
      }
      default: return null
    }
  }

  const getJob = () => {
    if (!job || !Object.values(job).length) return null

    if (determineJobWithoutActiveRole(job)) {
      const emptyJob = job && Object.values(job).every((value) => value === '')

      return (
        <>
          {job && !emptyJob && (
            <div className={styles.jobContainer}>
              {job.company && <div className={styles.company}>{job.company}</div>}
              {job.title && <div className={styles.title}>{job.title}</div>}
              {job.headline && <div className={styles.headline}>{job.headline}</div>}
              {job.position && <div className={styles.position}>{job.position}</div>}
            </div>
          )}
        </>
      )
    }

    if (!activeRole || !job || !job[activeRole]) return null

    const emptyJob = job && activeRole && Object.values(job[activeRole]).every((value) => value === '')

    return (
      <>
        {job && !emptyJob && (
          <div className={styles.jobContainer}>
            {job[activeRole].company && <div className={styles.company}>{job[activeRole].company}</div>}
            {job[activeRole].title && <div className={styles.title}>{job[activeRole].title}</div>}
            {job[activeRole].headline && <div className={styles.headline}>{job[activeRole].headline}</div>}
            {job[activeRole].position && <div className={styles.position}>{job[activeRole].position}</div>}
          </div>
        )}
      </>
    )
  }

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
        {getJob()}
        {typeUser !== 'mutuals' && (
          <div className={styles.buttonsContainer}>
            {getButtons()}
          </div>
        )}
      </div>
      <div className={styles.rightSide}>
        {rightSide}
      </div>
    </div>
  )
}
