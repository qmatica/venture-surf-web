import React, { FC } from 'react'
import styles from './styles.module.sass'

interface IToggle {
  id: string
  name: string
  description: string
  value?: string
  handleChange?: () => void
}

export const Toggle: FC<IToggle> = ({
  id, description, value, name, handleChange
}) => (
  <div>
    <label htmlFor={id}>
      <div className={styles.content}>
        <div className={styles.radio}>
          <input name={name} type="radio" id={id} value={value} onChange={handleChange} />
        </div>
        <div className={styles.description}>{description}</div>
      </div>
    </label>
  </div>
)
