import React, { FC, useState } from 'react'
import { Modal } from 'features/Modal'
import { Toggle } from 'features/Calendar/Toggle'
import { useDispatch, useSelector } from 'react-redux'
import { DELETE_SLOTS_MODAL_OPTIONS, DELETE_SLOTS_MODAL, DELETE_SLOTS_MODAL_VALUES } from 'features/Calendar/constants'
import { Button } from 'common/components/Button'
import { getMySlots, getAllMySlots } from 'features/Profile/selectors'
import moment from 'moment'
import { deleteSlots, disableSlots } from 'features/Profile/actions'
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
  const [selectedSlotType, setSelectedSlotType] = useState<string | undefined>()
  const isSubmitDisabled = !selectedSlotType

  const allMySlots = useSelector(getAllMySlots)
  const dispatch = useDispatch()

  const handelOnSubmit = () => {
    const selectedSlot = allMySlots.find(({ date }) => moment(date).isSame(selectedDateSlot))
    if (selectedSlot) {
      if (selectedSlotType === DELETE_SLOTS_MODAL_VALUES.ONE) {
        dispatch(disableSlots(selectedSlot))
      }
      if (selectedSlotType === DELETE_SLOTS_MODAL_VALUES.ALL) {
        dispatch(deleteSlots(selectedSlot))
      }
    }
    onSubmit()
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen} width={300} title={DELETE_SLOTS_MODAL.TITLE}>
      <>
        {DELETE_SLOTS_MODAL_OPTIONS.map(({ value, description }) => (
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
