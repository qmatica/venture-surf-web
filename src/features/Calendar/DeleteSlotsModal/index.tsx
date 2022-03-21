import React, { FC, useState } from 'react'
import moment from 'moment'
import { Modal } from 'features/Modal'
import { Toggle } from 'features/Calendar/Toggle'
import { useDispatch, useSelector } from 'react-redux'
import { DELETE_SLOTS_MODAL_OPTIONS, DELETE_SLOTS_MODAL } from 'features/Calendar/constants'
import { Button } from 'common/components/Button'
import { getAllMySlots } from 'features/Profile/selectors'
import { updateMySlots } from 'features/Profile/actions'
import styles from 'features/Calendar/styles.module.sass'
import { EnumTimeSlots } from 'features/Profile/types'

interface IDeleteSlotsModal {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  selectedDateSlot: string
}

export const DeleteSlotsModal: FC<IDeleteSlotsModal> = ({
  isOpen, onClose, onSubmit, selectedDateSlot
}) => {
  const allMySlots = useSelector(getAllMySlots)
  const dispatch = useDispatch()
  const [selectedSlotType, setSelectedSlotType] = useState<EnumTimeSlots | undefined>()
  const selectedSlot = allMySlots.find(({ date }) => moment(date).isSame(selectedDateSlot))
  const isSubmitDisabled = !selectedSlotType
  const RADIO_OPTIONS = [
    DELETE_SLOTS_MODAL_OPTIONS[EnumTimeSlots.DISABLE],
    selectedSlot && selectedSlot.reccurentIndex === 0
      ? DELETE_SLOTS_MODAL_OPTIONS[EnumTimeSlots.DELETE]
      : DELETE_SLOTS_MODAL_OPTIONS[EnumTimeSlots.CUT]
  ]

  const handelOnSubmit = () => {
    if (selectedSlot && selectedSlotType) {
      dispatch(updateMySlots(selectedSlot, selectedSlotType))
    }
    onSubmit()
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen} width={300} title={DELETE_SLOTS_MODAL.TITLE}>
      <>
        {RADIO_OPTIONS.map(({ value, description }) => (
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
