import React, { FC, useState, useEffect } from 'react'
import cn from 'classnames'
import { Button } from 'common/components/Button'
import {
  CHOOSE_SLOTS_MODAL, SLOTS_REPEAT, CHOOSE_SLOTS_MODAL_VALUES, WEEKDAYS
} from 'features/Calendar/constants'
import { Modal } from 'features/Modal'
import { getMySlots } from 'features/Profile/selectors'
import { useDispatch, useSelector } from 'react-redux'
import { updateTimeSlots } from 'features/Profile/actions'
import moment from 'moment'
import { Toggle } from 'features/Calendar/Toggle'
import styles from './styles.module.sass'
import calendarStyles from '../styles.module.sass'
import { SlotType } from '../types'

interface IChooseSlotsModal {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  selectedDateSlot: string
}

export const ChooseSlotsModal: FC<IChooseSlotsModal> = ({
  isOpen, onClose, onSubmit, selectedDateSlot
}) => {
  const [selectedSlotType, setSelectedSlotType] = useState<SlotType | undefined>()
  const currentDayOfWeek = new Date(selectedDateSlot).getDay()
  const [selectedWeekDays, setSelectedWeekDays] = useState<number[]>([])
  const [selectedWeek, setSelectedWeek] = useState(1)
  const endDateBasedOnWeeks = (weekCount: number) => moment(selectedDateSlot).add(weekCount, 'weeks').format('YYYY-MM-DD')
  const weekBasedOnEndDate = (endDate: string) => moment(endDate).add(1, 'd').diff(moment(selectedDateSlot), 'weeks')
  const [selectedEndDate, setSelectedEndDate] = useState(endDateBasedOnWeeks(selectedWeek))

  useEffect(() => {
    setSelectedEndDate(endDateBasedOnWeeks(selectedWeek))
  }, [selectedWeek])

  useEffect(() => {
    setSelectedWeek(weekBasedOnEndDate(selectedEndDate))
  }, [selectedEndDate])

  const weeks = Array(999).fill(0).map((_, i) => i + 1)
  const isSubmitDisabled = !selectedSlotType
  const mySlots = useSelector(getMySlots)
  const dispatch = useDispatch()
  const handelOnSubmit = () => {
    const action = mySlots.find(({ date }) => moment(date).isSame(selectedDateSlot)) ? 'del' : 'add'
    if (selectedSlotType === SLOTS_REPEAT.CUSTOM) {
      const recurrents = selectedWeekDays.reduce((acc) => [...acc, `W${selectedWeek}`], [`W${selectedWeek + 1}`])
      const dates = selectedWeekDays.reduce(
        (acc, dayOfWeek) => [
          ...acc,
          moment(selectedDateSlot)
            .day(dayOfWeek < currentDayOfWeek ? dayOfWeek + 7 : dayOfWeek)
            .format('YYYY-MM-DDTHH:mm:00')
        ], [moment(selectedDateSlot).format('YYYY-MM-DDTHH:mm:00')]
      )
      dispatch(updateTimeSlots('add', dates, recurrents as any))
    } else {
      dispatch(updateTimeSlots('add', selectedDateSlot, selectedSlotType))
    }
    onSubmit()
  }

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
              handleChange={() => setSelectedSlotType(value)}
              name="date"
            />
          ))}
        </div>
        {selectedSlotType === SLOTS_REPEAT.CUSTOM && (
          <div>
            <div className={styles.repeatDays}>
              <div className={styles.days}>{CHOOSE_SLOTS_MODAL.DAYS}</div>
              <div className={styles.weekDays}>
                {WEEKDAYS.map(({ value, label }) => (
                  <div
                    key={value}
                    className={cn(
                      styles.weekDay,
                      (selectedWeekDays.includes(value) || currentDayOfWeek === value) && styles.selectedWeekDay
                    )}
                    onClick={() => (
                      selectedWeekDays.includes(value)
                        ? setSelectedWeekDays(selectedWeekDays.filter(
                          (selectedWeekDay) => selectedWeekDay !== value
                          || selectedWeekDay === currentDayOfWeek
                        ))
                        : setSelectedWeekDays([...selectedWeekDays, value])
                    )}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.customRepeat}>
              <div>{CHOOSE_SLOTS_MODAL.WEEK}</div>
              <select
                className={styles.selectDays}
                onChange={({ target: { value } }) => setSelectedWeek(+value)}
                value={selectedWeek}
              >
                {weeks.map((week) => <option value={week} key={week}>{week} week{week > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div className={styles.customRepeat}>
              <div>{CHOOSE_SLOTS_MODAL.END_REPEAT_ON}</div>
              <input type="date" className={styles.selectDays} value={selectedEndDate} onChange={(({ target: { value } }) => setSelectedEndDate(value))} />
            </div>
          </div>
        )}
        <div className={calendarStyles.buttons}>
          <Button title={CHOOSE_SLOTS_MODAL.CANCEL} onClick={onClose} />
          <Button
            title={CHOOSE_SLOTS_MODAL.SUBMIT}
            onClick={handelOnSubmit}
            disabled={isSubmitDisabled}
            className={isSubmitDisabled ? calendarStyles.buttonDisabled : ''}
          />
        </div>
      </div>
    </Modal>
  )
}
