import React, { FC } from 'react'
import { Button } from 'common/components/Button'
import { CHOOSING_SLOTS_MODAL } from 'common/constants'
import { Modal } from 'features/Modal'
import { Toggle } from './Toggle/index'
import styles from './styles.module.sass'

interface IChoosingSlotsModal {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

export const ChoosingSlotsModal: FC<IChoosingSlotsModal> = ({ isOpen, onClose, onSubmit }) => (
  <Modal onClose={onClose} isOpen={isOpen} width={360}>
    <div>
      <div>
        <Toggle
          id={CHOOSING_SLOTS_MODAL.ONLY_CURRENT_DATE_ID}
          description={CHOOSING_SLOTS_MODAL.ONLY_CURRENT_DATE}
          name="date"
        />
        <Toggle
          id={CHOOSING_SLOTS_MODAL.WEEKLY}
          description={CHOOSING_SLOTS_MODAL.REPEAT_WEEKLY}
          name="date"
        />
        <Toggle
          id={CHOOSING_SLOTS_MODAL.DAILY}
          description={CHOOSING_SLOTS_MODAL.REPEAT_DAILY}
          name="date"
        />
        <Toggle
          id={CHOOSING_SLOTS_MODAL.CUSTOM_ID}
          description={CHOOSING_SLOTS_MODAL.CUSTOM}
          name="date"
        />
      </div>
      <div className={styles.buttons}>
        <Button title={CHOOSING_SLOTS_MODAL.SUBMIT} onClick={onSubmit} />
        <Button title={CHOOSING_SLOTS_MODAL.CANCEL} onClick={onClose} />
      </div>
    </div>
  </Modal>
)
