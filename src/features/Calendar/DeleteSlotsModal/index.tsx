import React, { FC, useState } from 'react'
import { Modal } from 'features/Modal'
import { Toggle } from 'features/Calendar/Toggle'
import { useDispatch, useSelector } from 'react-redux'
import { DELETE_SLOTS_MODAL_VALUES, DELETE_SLOTS_MODAL, SLOTS_REPEAT } from 'features/Calendar/constants'
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
  const [selectedSlotType, setSelectedSlotType] = useState<SlotType | undefined>()
  const isSubmitDisabled = !selectedSlotType

  const allMySlots = useSelector(getAllMySlots)
  const mySlots = useSelector(getMySlots)
  const dispatch = useDispatch()

  const handelOnSubmit = () => {
    const selectedSlot = allMySlots.find(({ date }) => moment(date).isSame(selectedDateSlot))
    if (selectedSlotType === SLOTS_REPEAT.ONE) {
      dispatch(disableSlots([`${selectedSlot?.parentDate}${selectedSlot?.reccurentIndex}`]))
    }
    if (selectedSlotType === SLOTS_REPEAT.ALL) {
      dispatch(deleteSlots([`${selectedSlot?.parentDate}`]))
    }
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
