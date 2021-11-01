import React, { FC } from 'react'
import {
  DownloadIcon, Edit2Icon, EyeIcon
} from 'common/icons'
import { ProfileType } from 'features/Profile/types'
import { Button } from 'common/components/Button'
import styles from './styles.module.sass'

interface IDeck {
  profile: ProfileType
  isEdit: boolean
}

export const Deck: FC<IDeck> = ({ profile, isEdit }) => {
  const { docs } = profile[profile.activeRole]
  const sortedDocs = docs._order_.map((key) => ({
    title: key,
    url: docs[key]
  }))

  const isEmpty = sortedDocs.length === 0

  const style = isEmpty ? { alignItems: 'center' } : {}

  return (
    <div className={styles.container}>
      <div className={styles.docsContainer} style={style}>
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
                <div className={styles.download}><DownloadIcon /></div>
                {isEdit && <div><Edit2Icon /></div>}
              </div>
            </div>
          </div>
        ))}
        {isEmpty && (
          <div className={styles.emptyTitle}>Add first document</div>
        )}
      </div>
      <div className={styles.buttonsContainer} style={style}>
        <Button title="Add deck" icon="plus" />
      </div>
    </div>
  )
}
