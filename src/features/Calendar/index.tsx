import React, { useState } from 'react'
import moment from 'moment'
import {
  MonthView, Scheduler, DateNavigator, Toolbar, ViewSwitcher, DayView, WeekView
} from '@devexpress/dx-react-scheduler-material-ui'
import { ViewState } from '@devexpress/dx-react-scheduler'
import { useDispatch, useSelector } from 'react-redux'
import { connectToCall, updateTimeSlots } from 'features/Profile/actions'
import { getAllMySlots } from 'features/Profile/selectors'
import { getMutuals } from 'features/Contacts/selectors'
import ReactTooltip from 'react-tooltip'
import { UserIcon } from 'common/icons'
import { Image } from 'common/components/Image'
import { ChooseSlotsModal } from 'features/Calendar/ChooseSlotsModal'
import { DeleteSlotsModal } from 'features/Calendar/DeleteSlotsModal'
import { SLOTS_REPEAT } from './constants'
import styles from './styles.module.sass'
import { FormattedSlotsType } from './types'

const schedulerData = [
  { startDate: '2021-12-02T23:30', endDate: '2021-12-02T23:45', title: 'Meeting' },
  { startDate: '2021-12-02T23:45', endDate: '2021-12-03T00:00', title: 'Go to a gym' }
]

const formatDate = (startDate: Date | undefined, minutes: string) =>
  moment(startDate).format(`YYYY-MM-DDTHH:${minutes}:00`)

interface ITimeTableCell {
  startDate?: Date
  otherSlots?: FormattedSlotsType
  uid?: string
  openChooseSlotsModal: () => void
  openDeleteSlotsModal: () => void
  setSelectedDateSlot: (selectedDateSlot: string) => void
}

const TimeTableCell = ({
  startDate, otherSlots, uid, openChooseSlotsModal, setSelectedDateSlot, openDeleteSlotsModal
}: ITimeTableCell) => {
  const dispatch = useDispatch()

  const mySlots = useSelector(getAllMySlots)
  const mutuals = useSelector(getMutuals)

  let hours: string | number | undefined = startDate?.getHours()
  hours = (`0${hours}`).slice(-2)

  const toggleTimeSlot = (selectedDate: string) => {
    const selectedSlot = mySlots.find(({ date }) => moment(date).isSame(selectedDate))
    const action = selectedSlot ? 'del' : 'add'
    if (uid) {
      dispatch(updateTimeSlots(action, selectedDate, 'Z'))
    } else {
      if (action === 'add') {
        openChooseSlotsModal()
      }
      if (action === 'del') {
        if (selectedSlot?.reccurent === SLOTS_REPEAT.CURRENT_DATE || !selectedSlot?.reccurent) {
          dispatch(updateTimeSlots(action, selectedSlot?.date as any, SLOTS_REPEAT.CURRENT_DATE))
        } else {
          openDeleteSlotsModal()
        }
      }
    }
  }

  const onConnectToCall = (date: string) => {
    if (uid) dispatch(connectToCall(date, uid))
  }

  return (
    <div className={styles.rowSlotsContainer}>
      {['00', '15', '30', '45'].map((minutes) => {
        const isTimeBefore = moment(startDate).add(+minutes, 'minutes').isBefore(moment(new Date()))
        const dateSlot = formatDate(startDate, minutes)

        const myScheduledSlot = mySlots.find((slot) => slot.status === 'scheduled' && moment(slot.date).isSame(dateSlot))
        const otherSlot = otherSlots?.find((slot) => {
          if (slot.reccurent === 'D') {
            return moment(slot.date).format('HH:mm') === moment(dateSlot).format('HH:mm')
          }
          if (slot.reccurent === 'W') {
            if (moment(slot.date).day() === moment(dateSlot).day()) {
              return moment(slot.date).format('HH:mm') === moment(dateSlot).format('HH:mm')
            }
          }
          return moment(slot.date).isSame(dateSlot)
        })

        const companion = mutuals?.find((mutual) => mutual.uid === myScheduledSlot?.uid)

        const classNameMyOpenedSlot =
          !otherSlots && mySlots.find((slot) => slot.status === 'free' && moment(slot.date).isSame(dateSlot))
            ? styles.myOpenedSlot
            : ''

        const classNameMyScheduledSlot = myScheduledSlot ? styles.myScheduledSlot : ''

        const classNameIsClosedSlot = !otherSlots || otherSlot ? '' : styles.closedSlot

        const classNameIsTimeBefore = isTimeBefore ? styles.closedSlot : ''

        return (
          <div
            key={dateSlot}
            className={`${classNameMyOpenedSlot} ${classNameIsTimeBefore} ${classNameIsClosedSlot} ${classNameMyScheduledSlot}`}
            onClick={() => {
              setSelectedDateSlot(dateSlot)
              if (myScheduledSlot || isTimeBefore) return
              if (otherSlots) {
                if (otherSlot) onConnectToCall(dateSlot)
                return
              }
              toggleTimeSlot(dateSlot)
            }}
          >
            {companion && (
              <div
                className={styles.companionPhoto}
                data-tip={`Meeting with ${companion.displayName}`}
                data-place="bottom"
                data-effect="solid"
              >
                <Image
                  photoURL={companion.photoURL}
                  photoBase64={companion.photoBase64}
                  alt={companion.displayName}
                  userIcon={UserIcon}
                />
              </div>
            )}
            {hours}:{minutes}
          </div>
        )
      })}
    </div>
  )
}

export const Calendar = ({ otherSlots, uid }: { otherSlots?: any, uid?: string }) => {
  const toDay = new Date()
  const [currentDate, setCurrentDate] = useState<Date | string>(new Date())
  const [currentViewName, setCurrentViewName] = useState('Day')
  const [isChooseSlotsModalOpen, setIsChooseSlotsModalOpen] = useState(false)
  const [isDeleteSlotsModalOpen, setIsDeleteSlotsModalOpen] = useState(false)
  const [selectedDateSlot, setSelectedDateSlot] = useState('')

  const onCurrentDateChange = (value: Date) => {
    setCurrentDate(value)
  }

  const onCurrentViewNameChange = (value: string) => {
    setCurrentViewName(value)
  }

  return (
    <>
      <div className={styles.container}>
        <Scheduler data={schedulerData}>
          <ViewState
            currentDate={currentDate}
            onCurrentDateChange={onCurrentDateChange}
            currentViewName={currentViewName}
            onCurrentViewNameChange={onCurrentViewNameChange}
          />
          <DayView
            startDayHour={moment(toDay).isSame(moment(currentDate), 'day')
              ? toDay.getHours()
              : undefined}
            cellDuration={60}
            timeTableCellComponent={(props) => TimeTableCell({
              ...props,
              otherSlots,
              uid,
              openChooseSlotsModal: () => setIsChooseSlotsModalOpen(true),
              openDeleteSlotsModal: () => setIsDeleteSlotsModalOpen(true),
              setSelectedDateSlot
            })}
          />
          <WeekView cellDuration={15} />
          <MonthView />
          <Toolbar />
          <DateNavigator />
          <ViewSwitcher />
        </Scheduler>
        <ReactTooltip />
      </div>
      {isChooseSlotsModalOpen && (
        <ChooseSlotsModal
          selectedDateSlot={selectedDateSlot}
          isOpen
          onClose={() => setIsChooseSlotsModalOpen(false)}
          onSubmit={() => setIsChooseSlotsModalOpen(false)}
        />
      )}
      {isDeleteSlotsModalOpen && (
        <DeleteSlotsModal
          selectedDateSlot={selectedDateSlot}
          isOpen
          onClose={() => setIsDeleteSlotsModalOpen(false)}
          onSubmit={() => setIsDeleteSlotsModalOpen(false)}
        />
      )}
    </>
  )
}
