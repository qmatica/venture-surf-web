import React, { FC, useState } from 'react'
import styles from './styles.module.sass'

interface IInput {
  name?: string
  placeholder?: string
  title?: string
  initialValue?: string
}

export const Input: FC<IInput> = ({
  name, placeholder, title, initialValue = ''
}) => {
  const [value, setValue] = useState(initialValue)
  const onChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setValue(value)
  return (
    <div className={styles.container}>
      {title && <div className={styles.title}>{title}</div>}
      <input
        name={name}
        className={styles.input}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}
