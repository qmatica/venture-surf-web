import React, { FC } from 'react'
import { Button } from 'common/components/Button'
import styles from './styles.module.sass'
import { UserType } from '../../types'

interface IHeader {
    user: UserType
    rightSide?: React.ReactElement
}

export const Header: FC<IHeader> = ({
  user,
  rightSide
}) => {
  const name = user.name || user.displayName || `${user.first_name} ${user.last_name}`
  const {
    photoURL, job, actions, loaders, activeActions
  } = user
  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        {photoURL && <img src={photoURL} alt={name} />}
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.name}>
          {name}
        </div>
        {job && (
        <div className={styles.jobContainer}>
          {job.company && <div className={styles.company}>{job.company}</div>}
          {job.title && <div className={styles.title}>{job.title}</div>}
          {job.headline && <div className={styles.headline}>{job.headline}</div>}
          {job.position && <div className={styles.position}>{job.position}</div>}
        </div>
        )}
        {activeActions?.map((activeAction) => {
          if (!actions) return null
          return (
            <Button
              title={activeAction}
              width="135"
              isLoading={loaders.includes(activeAction)}
              onClick={actions[activeAction]}
            />
          )
        })}
      </div>
      {rightSide}
    </div>
  )
}
