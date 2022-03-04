import React, { FC } from 'react'
import { Button } from 'common/components/Button'
import { CHOOSING_SLOTS_MODAL, CUSTOM_REPEAT_MODAL } from 'common/constants'
import { Modal } from 'features/Modal'
import styles from './styles.module.sass'

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F']

interface ICustomRepeatModal {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

export const CustomRepeatModal: FC<ICustomRepeatModal> = ({ isOpen, onClose, onSubmit }) => (
  <Modal onClose={onClose} isOpen={isOpen} width={360}>
    <div>
      <div className={styles.title}>{CUSTOM_REPEAT_MODAL.TITLE}</div>
      <div className={styles.repeatDays}>
        <div className={styles.days}>{CUSTOM_REPEAT_MODAL.DAYS}</div>
        <div className={styles.weekDays}>
          {weekDays.map((weekDay) => (
            <button className={styles.button} key={weekDay}>{weekDay}</button>
          ))}
        </div>
      </div>
      <div className={styles.customRepeat}>
        <div>{CUSTOM_REPEAT_MODAL.WEEK}</div>
        <div className={styles.customDate}>
          1 week
        </div>
      </div>
      <div className={styles.customRepeat}>
        <div>{CUSTOM_REPEAT_MODAL.CUSTOM_REPEAT}</div>
        <div className={styles.customDate}>
          Mar 15, 2022
        </div>
      </div>
      <div className={styles.buttons}>
        <Button title={CUSTOM_REPEAT_MODAL.BACK} onClick={onClose} />
        <Button title={CHOOSING_SLOTS_MODAL.SUBMIT} onClick={onSubmit} />
      </div>
    </div>
  </Modal>
)
