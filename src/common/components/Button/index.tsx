import React, { FC } from 'react'
import styles from './styles.module.sass'

interface IButton {
    onClick?: () => void
    title: string
    icon?: React.ReactElement
    className?: string
    width: string
}

export const Button: FC<IButton> = ({
  onClick, title, icon, className, width
}) => (
  <div onClick={onClick} className={`${styles.button} ${className}`} style={{ width: `${width}px` }}>
    {icon} {title}
  </div>
)
