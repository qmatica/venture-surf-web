import React, { FC } from 'react'
import { ProfileType, VideoType, JobType } from 'features/Profile/types'
import { SSL_OP_NO_TLSv1 } from 'constants'
import styles from './styles.module.sass'

interface ICountBadge {
  profile: ProfileType
  value?: 'videos' | 'docs'
}

export const CountBadge: FC<ICountBadge> = ({ profile, value }) => {
  const count = value ? profile[profile.activeRole][value]?._order_?.length : 0
  return count ? (<div className={styles.profileCountBadge}>({count})</div>) : null
}
