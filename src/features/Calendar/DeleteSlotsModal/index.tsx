import React, { FC, useState } from 'react'
import { Modal } from 'features/Modal'
import { Toggle } from 'features/Calendar/Toggle'
import { DELETE_SLOTS_MODAL_VALUES, DELETE_SLOTS_MODAL } from 'features/Calendar/constants'
import { Button } from 'common/components/Button'
import { useSelector } from 'react-redux'
import { getMySlots } from 'features/Profile/selectors'
import moment from 'moment'
import styles from '../styles.module.sass'
import { SlotType } from '../types'

interface IDeleteSlotsModal {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  selectedDateSlot: string
}

export const DeleteSlotsModal: FC<IDeleteSlotsModal> = ({
  isOpen, onClose, onSubmit, selectedDateSlot
}) => {
  const [selectedSlotType, setSelectedSlotType] = useState<SlotType | undefined>()
  const isSubmitDisabled = !selectedSlotType

  const mySlots = useSelector(getMySlots)

  // TODO: correct handelOnSubmit function
  const handelOnSubmit = () => {
    const action = mySlots.find(({ date }) => moment(date).isSame(selectedDateSlot)) ? 'del' : 'add'
    onSubmit()
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen} width={300} title={DELETE_SLOTS_MODAL.TITLE}>
      <>
        {DELETE_SLOTS_MODAL_VALUES.map(({ value, description }) => (
          <Toggle
            key={value}
            id={value}
            description={description}
            value={value}
            handleChange={() => setSelectedSlotType(value)}
            name="date"
          />
        ))}
        <div className={styles.buttons}>
          <Button title={DELETE_SLOTS_MODAL.CANCEL} onClick={onClose} />
          <Button
            onClick={handelOnSubmit}
            title={DELETE_SLOTS_MODAL.SUBMIT}
            disabled={isSubmitDisabled}
            className={isSubmitDisabled ? styles.buttonDisabled : ''}
          />
        </div>
      </>
    </Modal>
  )
}
