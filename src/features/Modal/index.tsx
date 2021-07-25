import React, { FC, ReactElement } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'common/types'
import { CloseIcon, PreloaderIcon } from 'common/icons'
import { ModalButtonType } from 'features/Modal/types'
import styles from './styles.module.sass'
import { actions } from './actions'

interface IModal {
  children?: ReactElement | null
  modalName: string
  title: string
  modalButtons?: ModalButtonType[]
}

export const Modal: FC<IModal> = ({
  children,
  modalName,
  title,
  modalButtons
}) => {
  const { openModals } = useSelector((state: RootState) => state.modal)
  const dispatch = useDispatch()

  const checkModal = openModals.find((modal) => modal.modalName === modalName)

  if (!checkModal) return null

  const close = () => dispatch(actions.closeModal(modalName))

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <div className={styles.close} onClick={close}><CloseIcon /></div>
        </div>
        {children}
        <div className={styles.footer}>
          {modalButtons?.map(({
            title, className, action, preloader
          }) => (
            <div
              key={title}
              className={`${styles.button} ${className}`}
              onClick={action || close}
            >
              {checkModal.isLoading && preloader ? <PreloaderIcon stroke="#1557FF" /> : title}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.overlayClose} onClick={close} />
    </div>
  )
}
