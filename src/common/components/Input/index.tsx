import React, { FC, useState } from 'react'
import styles from './styles.module.sass'

interface IInput {
  name?: string
  placeholder?: string
  title?: string
  initialValue?: string
  onChange?: (text: string) => void
  value?: string
}

export const Input: FC<IInput> = ({
  name, placeholder, title, initialValue = '', onChange, value
}) => {
  const [text, setText] = useState(initialValue)
  const onChangeText = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(value)
      return
    }
    setText(value)
  }
  return (
    <div className={styles.container}>
      {title && <div className={styles.title}>{title}</div>}
      <input
        name={name}
        className={styles.input}
        type="text"
        value={value || text}
        onChange={onChangeText}
        placeholder={placeholder}
      />
    </div>
  )
}
