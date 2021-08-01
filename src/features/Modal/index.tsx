import React, { FC, ReactElement } from 'react'
import { CloseIcon } from 'common/icons'
import styles from './styles.module.sass'

interface IModal {
  title: string
  isOpen: boolean
  onClose: () => void
  children?: ReactElement | null
}

export const Modal: FC<IModal> = ({
  title,
  isOpen,
  onClose,
  children
}) => {
  if (!isOpen) return null

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <div className={styles.close} onClick={onClose}><CloseIcon /></div>
        </div>
        {children}
      </div>
      <div className={styles.overlayClose} onClick={onClose} />
    </div>
  )
}
