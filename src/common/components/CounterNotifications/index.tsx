import React, { FC } from 'react'
import styles from './styles.module.sass'

interface ICounterNotifications {
  count?: number
  left?: number
}

export const CounterNotifications: FC<ICounterNotifications> = ({ count, left = 0 }) => {
  if (!count) return null
  const countNotify = count > 99 ? '+99' : count
  return (
    <div
      className={styles.countNotifications}
      style={{ left: `calc(100% + ${left}px)` }}
    >
      {countNotify}
    </div>
  )
}
