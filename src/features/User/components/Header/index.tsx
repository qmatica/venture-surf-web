import React, { FC } from 'react'
import styles from './styles.module.sass'

interface IHeader {
    name: string
    photoURL?: string | null
    job?: {
        company?: string
        title?: string
        headline?: string
        position?: string
    }
    activeButtons?: React.FC<any>
    rightSide?: React.ReactElement
}

export const Header: FC<IHeader> = ({
  name,
  photoURL,
  job,
  activeButtons,
  rightSide
}) => (
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
      {activeButtons}
    </div>
    {rightSide}
  </div>
)
