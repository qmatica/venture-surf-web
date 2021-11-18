import React, { useState } from 'react'
import moment from 'moment'
import {
  MonthView, Scheduler, DateNavigator, Toolbar, ViewSwitcher, DayView, WeekView
} from '@devexpress/dx-react-scheduler-material-ui'
import { ViewState } from '@devexpress/dx-react-scheduler'
import { useDispatch, useSelector } from 'react-redux'
import { updateTimeSlots } from 'features/Profile/actions'
import { getMySlots } from 'features/Profile/selectors'
import styles from './styles.module.sass'

const schedulerData = [
  { startDate: '2021-11-18T00:00', endDate: '2021-11-18T00:15', title: 'Meeting' },
  { startDate: '2021-11-18T00:15', endDate: '2021-11-18T00:30', title: 'Go to a gym' }
]

const formatDate = (startDate: Date | undefined, minutes: string) => {
  const date = moment(startDate).format(`YYYY-MM-DDTHH:${minutes}:00`)
  return `${date}Z`
}

const TimeTableCell = ({ startDate }: { startDate?: Date }) => {
  const dispatch = useDispatch()
  const slots = useSelector(getMySlots)
  let hours: string | number | undefined = startDate?.getHours()
  hours = (`0${hours}`).slice(-2)

  const toggleTimeSlot = (date: string) => {
    const action = (slots && slots[date]) ? 'del' : 'add'
    dispatch(updateTimeSlots(action, date))
  }

  return (
    <div className={styles.rowSlotsContainer}>
      {['00', '15', '30', '45'].map((minutes) => {
        const isTimeBefore = moment(startDate).add(+minutes, 'minutes').isBefore(moment(new Date()))
        const dateSlot = formatDate(startDate, minutes)

        const classNameIsActive = (slots && slots[dateSlot]) ? styles.activeSlot : undefined
        const classNameIsTimeBefore = isTimeBefore ? styles.isTimeBefore : undefined

        return (
          <div
            className={`${classNameIsActive} ${classNameIsTimeBefore}`}
            onClick={() => {
              if (!isTimeBefore) toggleTimeSlot(dateSlot)
            }}
          >
            {hours}:{minutes}
          </div>
        )
      })}
    </div>
  )
}

export const Calendar = () => {
  const toDay = new Date()
  const [currentDate, setCurrentDate] = useState<Date | string>(new Date())
  const [currentViewName, setCurrentViewName] = useState('Day')

  const onCurrentDateChange = (value: Date) => {
    setCurrentDate(value)
  }

  const onCurrentViewNameChange = (value: string) => {
    setCurrentViewName(value)
  }

  return (
    <div className={styles.container}>
      <Scheduler
        data={schedulerData}
      >
        <ViewState
          currentDate={currentDate}
          onCurrentDateChange={onCurrentDateChange}
          currentViewName={currentViewName}
          onCurrentViewNameChange={onCurrentViewNameChange}
        />
        <DayView
          // startDayHour={moment(toDay).isSame(moment(currentDate), 'day')
          //   ? toDay.getHours()
          //   : undefined}
          cellDuration={60}
          timeTableCellComponent={TimeTableCell}
        />
        <WeekView cellDuration={15} />
        <MonthView />
        <Toolbar />
        <DateNavigator />
        <ViewSwitcher />
      </Scheduler>
    </div>
  )
}
