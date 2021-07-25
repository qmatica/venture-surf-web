import React, { FC } from 'react'
import styles from './styles.module.sass'

interface IText {
    value: string
    onChange: (text: string) => void
}

export const EditText: FC<IText> = ({ value, onChange }) => (
  <div className={styles.content}>
    <textarea value={value} onChange={({ target: { value } }) => onChange(value)} />
  </div>
)
