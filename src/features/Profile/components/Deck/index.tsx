import React, { FC } from 'react'
import { DownloadIcon, Edit2Icon, EyeIcon } from 'common/icons'
import { ProfileType } from 'features/Profile/types'
import styles from './styles.module.sass'

interface IDeck {
  profile: ProfileType
}

export const Deck: FC<IDeck> = ({ profile }) => {
  const { docs } = profile[profile.activeRole]
  const sortedDocs = docs._order_.map((key) => ({
    title: key,
    url: docs[key]
  }))
  return (
    <div className={styles.container}>
      <div className={styles.docsContainer}>
        {sortedDocs.map(({ title, url }) => (
          <div key={title} className={styles.wrapper}>
            <div className={styles.doc}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <div className={styles.info}>
                  <div className={styles.img} />
                  <div>
                    <div className={styles.title}>{title}</div>
                    <div className={styles.format}>PDF</div>
                  </div>
                </div>
              </a>
              <div className={styles.actions}>
                <div><EyeIcon /></div>
                <div><DownloadIcon /></div>
                <div><Edit2Icon /></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.buttonsContainer}>
        <div>+ Add deck</div>
      </div>
    </div>
  )
}
