import React, {
  createRef, FC, useEffect, useState
} from 'react'
import { PreloaderIcon } from 'common/icons'
import styles from './styles.module.sass'

interface IButton {
    onClick?: () => void
    isLoading?: boolean
    title: string
    icon?: React.ReactElement
    className?: string
}

export const Button: FC<IButton> = ({
  onClick,
  isLoading,
  title,
  icon,
  className
}) => {
  const buttonRef = createRef<HTMLDivElement>()
  const [width, setWidth] = useState<number | undefined>()
  useEffect(() => {
    setWidth(buttonRef.current?.offsetWidth)
  }, [])

  useEffect(() => {
    if (width) setWidth(undefined)
  }, [title])

  const style = width ? { width: `${width}px` } : { padding: '0 20px' }
  return (
    <div
      onClick={isLoading ? undefined : onClick}
      className={`${styles.button} ${className}`}
      style={{ borderColor: isLoading ? '#BFD5FA' : '', ...style }}
      ref={buttonRef}
    >
      {isLoading ? <PreloaderIcon stroke="#96baf6" /> : <>{icon} {title}</>}
    </div>
  )
}
