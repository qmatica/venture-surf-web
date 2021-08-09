import React, { FC } from 'react'
import { PreloaderIcon } from 'common/icons'
import styles from './styles.module.sass'

interface IButton {
    onClick?: () => void
    isLoading?: boolean
    title: string
    icon?: React.ReactElement
    className?: string
    width: string
}

export const Button: FC<IButton> = ({
  onClick,
  isLoading,
  title,
  icon,
  className,
  width
}) => (
  <div onClick={onClick} className={`${styles.button} ${className}`} style={{ width: `${width}px` }}>
    {isLoading ? <PreloaderIcon stroke="#96baf6" /> : <>{icon} {title}</>}
  </div>
)
