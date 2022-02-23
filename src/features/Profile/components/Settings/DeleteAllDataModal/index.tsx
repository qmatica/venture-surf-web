import React, { FC } from 'react'
import { Button } from 'common/components/Button'
import { DELETE_ALL_DATA_MODAL } from 'common/constants'
import { Modal } from 'features/Modal'
import styles from './styles.module.sass'

interface IDeleteAllDataModal {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

export const DeleteAllDataModal: FC<IDeleteAllDataModal> = ({ isOpen, onClose, onSubmit }) => (
  <Modal onClose={onClose} isOpen={isOpen} width={360}>
    <div className={styles.wrapper}>
      <div>
        <div className={styles.title}>{DELETE_ALL_DATA_MODAL.TITLE}</div>
        <div className={styles.body}>{DELETE_ALL_DATA_MODAL.BODY}</div>
        <div className={styles.body}>{DELETE_ALL_DATA_MODAL.WARNING}</div>
        <div className={styles.body}>{DELETE_ALL_DATA_MODAL.CONFIRMATION}</div>
      </div>
      <div className={styles.buttons}>
        <Button title={DELETE_ALL_DATA_MODAL.DELETE} onClick={onSubmit} />
        <Button title={DELETE_ALL_DATA_MODAL.CANCEL} onClick={onClose} />
      </div>
    </div>
  </Modal>
)
