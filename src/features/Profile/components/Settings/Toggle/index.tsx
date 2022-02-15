import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'
import styles from './styles.module.sass'

interface IToggle {
  id: string
  discription: string
}

export const Toggle: FC<IToggle> = ({ id, discription }) => (
  <div className={styles.notifications}>
    <div>{discription}</div>
    <label className={styles.switch} htmlFor={id}>
      <input type="checkbox" id={id} />
      <span className={cn(styles.slider, styles.round)} />
    </label>
  </div>
)
