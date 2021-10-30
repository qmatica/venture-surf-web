import React, {
  createRef, FC, useEffect, useState
} from 'react'
import {
  CalendarMinIcon,
  LikeIcon,
  MailIconMin,
  PeopleIcon,
  PhoneCallIcon,
  WithdrawLikeIcon,
  PreloaderIcon,
  Edit2Icon,
  PlusIcon,
  VideoOnIcon,
  VideoOffIcon
} from 'common/icons'
import styles from './styles.module.sass'

interface IButton {
    type?: 'submit' | 'button'
    onClick?: () => void
    isLoading?: boolean
    title: string
    icon?:
        'calendar'
      | 'like'
      | 'mail'
      | 'people'
      | 'phone'
      | 'withdrawLike'
      | 'edit'
      | 'plus'
      | 'onVideo'
      | 'offVideo'
    className?: string
    disabled?: boolean
}

export const Button: FC<IButton> = ({
  type = 'button',
  onClick,
  isLoading,
  title,
  icon,
  className,
  disabled
}) => {
  const buttonRef = createRef<HTMLButtonElement>()
  const [width, setWidth] = useState<number | undefined>()

  // useEffect(() => {
  //   setWidth(buttonRef.current?.offsetWidth)
  // }, [])

  const getIcon = () => {
    switch (icon) {
      case 'calendar':
        return <CalendarMinIcon />
      case 'like':
        return <LikeIcon />
      case 'mail':
        return <MailIconMin />
      case 'people':
        return <PeopleIcon />
      case 'phone':
        return <PhoneCallIcon />
      case 'withdrawLike':
        return <WithdrawLikeIcon />
      case 'edit':
        return <Edit2Icon size="17" />
      case 'plus':
        return <PlusIcon />
      case 'onVideo':
        return <VideoOnIcon />
      case 'offVideo':
        return <VideoOffIcon />
      default: return null
    }
  }

  const style = width ? { width: `${width}px` } : { padding: '0 20px' }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${className}`}
      style={{ borderColor: isLoading ? '#BFD5FA' : '', ...style }}
      ref={buttonRef}
      disabled={disabled}
    >
      {isLoading ? <PreloaderIcon stroke="#96baf6" /> : <>{getIcon()} {title}</>}
    </button>
  )
}
