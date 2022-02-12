import React, { FC } from 'react'
import styles from './styles.module.sass'

interface IDot {
  left?: number | 'unset'
  right?: number | 'unset'
  top?: number | 'unset'
  bottom?: number | 'unset'
}

export const Dot: FC<IDot> = ({
  left = 'unset', right = 'unset', top = 'unset', bottom = 'unset'
}) => (
  <div
    className={styles.dot}
    style={{
      left, right, top, bottom
    }}
  />
)
