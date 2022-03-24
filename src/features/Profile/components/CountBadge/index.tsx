import React, { FC } from 'react'
import { ProfileType } from 'features/Profile/types'
import styles from './styles.module.sass'

interface ICountBadge {
  profile: ProfileType
  value?: 'docs'
}

export const CountBadge: FC<ICountBadge> = ({ profile, value }) => {
  const count = value ? profile[profile.activeRole][value]?._order_?.length : 0
  return count ? (<div className={styles.profileCountBadge}>({count})</div>) : null
}
