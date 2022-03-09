import React, { FC, useState } from 'react'
import cn from 'classnames'
import { Button } from 'common/components/Button'
import { CHOOSE_SLOTS_MODAL, SLOTS_REPEAT } from 'features/Calendar/constants'
import { Modal } from 'features/Modal'
import { Toggle } from './Toggle/index'
import styles from './styles.module.sass'

interface IChooseSlotsModal {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

const CHOOSE_SLOTS_MODAL_VALUES = [
  {
    value: SLOTS_REPEAT.CURRENT_DATE,
    description: CHOOSE_SLOTS_MODAL.ONLY_CURRENT_DATE
  },
  {
    value: SLOTS_REPEAT.WEEKLY,
    description: CHOOSE_SLOTS_MODAL.REPEAT_WEEKLY
  },
  {
    value: SLOTS_REPEAT.DAILY,
    description: CHOOSE_SLOTS_MODAL.REPEAT_DAILY
  },
  {
    value: SLOTS_REPEAT.CUSTOM,
    description: CHOOSE_SLOTS_MODAL.CUSTOM
  }
]

export const ChooseSlotsModal: FC<IChooseSlotsModal> = ({
  isOpen, onClose, onSubmit
}) => {
  const [repeatSlots, setIsModalOpen] = useState('')
  const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>([])
  const [selectedEndDate, setSelectedEndDate] = useState('')
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const weeks = Array(7).fill(0).map((_, i) => i + 1)
  const isSubmitDisabled = !repeatSlots
    || (repeatSlots === SLOTS_REPEAT.CUSTOM && (!selectedWeekDays.length || !selectedEndDate))

  return (
    <Modal onClose={onClose} isOpen={isOpen} width={550}>
      <div>
        <div>
          {CHOOSE_SLOTS_MODAL_VALUES.map(({ value, description }) => (
            <Toggle
              key={value}
              id={value}
              description={description}
              value={value}
              handleChange={() => setIsModalOpen(value)}
              name="date"
            />
          ))}
        </div>
        {repeatSlots === SLOTS_REPEAT.CUSTOM && (
          <div>
            <div className={styles.repeatDays}>
              <div className={styles.days}>{CHOOSE_SLOTS_MODAL.DAYS}</div>
              <div className={styles.weekDays}>
                {weekDays.map((weekDay) => (
                  <div
                    key={weekDay}
                    className={cn(styles.weekDay, selectedWeekDays.includes(weekDay) && styles.selectedWeekDay)}
                    onClick={() => (
                      selectedWeekDays.includes(weekDay)
                        ? setSelectedWeekDays(selectedWeekDays.filter((selectedWeekDay) => selectedWeekDay !== weekDay))
                        : setSelectedWeekDays([...selectedWeekDays, weekDay])
                    )}
                  >
                    {weekDay}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.customRepeat}>
              <div>{CHOOSE_SLOTS_MODAL.WEEK}</div>
              <select className={styles.selectDays}>
                {weeks.map((week) => <option value={week} key={week}>{week} week{week > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div className={styles.customRepeat}>
              <div>{CHOOSE_SLOTS_MODAL.END_REPEAT_ON}</div>
              <input type="date" className={styles.selectDays} onChange={((e) => setSelectedEndDate(e.target.value))} />
            </div>
          </div>
        )}
        <div className={styles.buttons}>
          <Button title={CHOOSE_SLOTS_MODAL.CANCEL} onClick={onClose} />
          {/* TODO: Add onSubmit functionality & isLoading when is submitting */}
          <Button
            title={CHOOSE_SLOTS_MODAL.SUBMIT}
            onClick={onSubmit}
            disabled={isSubmitDisabled}
            className={isSubmitDisabled ? styles.buttonDisabled : ''}
          />
        </div>
      </div>
    </Modal>
  )
}
