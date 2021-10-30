import React, { FC, ReactElement } from 'react'
import { CloseIcon } from 'common/icons'
import styles from './styles.module.sass'

interface IModal {
  title: string | undefined
  isOpen: boolean
  onClose: () => void
  children?: ReactElement | null
  width?: number | string
}

export const Modal: FC<IModal> = ({
  title,
  isOpen,
  onClose,
  children,
  width = 560
}) => {
  if (!isOpen) return null

  return (
    <div className={styles.wrapper}>
      <div className={styles.container} style={{ width }}>
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
