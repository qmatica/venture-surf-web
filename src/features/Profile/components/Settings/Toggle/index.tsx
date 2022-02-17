import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'
import styles from './styles.module.sass'

interface IToggle {
  id: string
  description: string
  value?: boolean
  onClick?: () => void
}

export const Toggle: FC<IToggle> = ({
  id, description, value, onClick
}) => (
  <div className={styles.notifications}>
    <div className={styles.description}>{description}</div>
    <label className={styles.switch} htmlFor={id}>
      <input type="checkbox" id={id} checked={value} onClick={onClick} />
      <span className={cn(styles.slider, styles.round)} />
    </label>
  </div>
)
