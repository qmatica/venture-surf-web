import React, { FC, forwardRef, LegacyRef } from 'react'
import { ChangeHandler } from 'react-hook-form/dist/types'
import styles from './styles.module.sass'

interface IInput {
  name?: string
  placeholder?: string
  title?: string
  defaultValue?: string
  onChange?: ChangeHandler
  onBlur?: ChangeHandler
  value?: string
  errorMsg?: string
}

export const Input: FC<IInput> = forwardRef(({
  name,
  placeholder,
  title,
  defaultValue,
  onChange,
  onBlur,
  value,
  errorMsg
}, ref) => (
  <div className={styles.container}>
    {title && <div className={styles.title}>{title}</div>}
    <input
      name={name}
      ref={ref as LegacyRef<HTMLInputElement> | undefined}
      className={styles.input}
      type="text"
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
    />
    <p>{errorMsg}</p>
  </div>
))
