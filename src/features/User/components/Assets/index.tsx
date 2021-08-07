import React, { FC } from 'react'
import { UserIcon } from 'common/icons'
import styles from './styles.module.sass'

interface IAssets {}

export const Assets: FC<IAssets> = () => (
  <div className={styles.container}>
    <div className={styles.header}>
      <div className={styles.title}>Investments</div>
      <div className={styles.link}>See all</div>
    </div>
    <div className={styles.users}>
      <div className={styles.user}>
        <div className={styles.userPhoto}><UserIcon /></div>
        <div>User</div>
      </div>
    </div>
  </div>
)
