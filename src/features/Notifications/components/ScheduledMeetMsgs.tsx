import React, { FC, useEffect, useState } from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { Button } from 'common/components/Button'
import { CloseIcon } from 'common/icons'
import { callNow } from 'features/Profile/actions'
import { actions as actionsCalendar } from 'features/Calendar/actions'
import { actions } from '../actions'
import styles from '../styles.module.sass'

type ScheduledMeetMsgType = {
  date: string
  name: string
  uid: string
  uidMsg: string
  secondsToMeet: number
}

interface IScheduledMeetMsgs {
  msgs: ScheduledMeetMsgType[]
}

export const ScheduledMeetMsgs: FC<IScheduledMeetMsgs> = ({ msgs }) => {
  const dispatch = useDispatch()

  const onCall = (uid: string, uidMsg: string) => {
    dispatch(callNow(uid))
    dispatch(actions.removeScheduledMeetMsg(uidMsg))
  }

  const onRemind = (date: string, name: string, uid: string, uidMsg: string, secondsToNotify: number) => {
    dispatch(actionsCalendar.addClosedNotify(date))
    dispatch(actions.removeScheduledMeetMsg(uidMsg))

    setTimeout(() => {
      dispatch(actions.addScheduledMeetMsg(date, name, uid, uidMsg, 0))
    }, secondsToNotify)
  }

  const removeScheduledMeetMsg = (date: string, uidMsg: string) => {
    dispatch(actionsCalendar.addClosedNotify(date))
    dispatch(actions.removeScheduledMeetMsg(uidMsg))
  }

  return (
    <>
      {msgs.map((msg) => (
        <Msg key={msg.uidMsg} msg={msg} onCall={onCall} onRemind={onRemind} onRemove={removeScheduledMeetMsg} />
      ))}
    </>
  )
}

interface IMsg {
  msg: ScheduledMeetMsgType
  onCall: (uid: string, uidMsg: string) => void
  onRemind: (date: string, name: string, uid: string, uidMsg: string, secondsToNotify: number) => void
  onRemove: (date: string, uidMsg: string) => void
}

const Msg: FC<IMsg> = ({
  msg, onCall, onRemind, onRemove
}) => {
  const {
    secondsToMeet, date, name, uid, uidMsg
  } = msg

  const [seconds, setSeconds] = useState(secondsToMeet)

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (seconds > 0) {
        setSeconds((s) => {
          if (s === 0) {
            clearInterval(intervalId)
            return s
          }
          return s - 1
        })
      }
    }, 1000)
  }, [])

  const min = moment.utc(seconds * 1000).format('m')
  const sec = moment.utc(seconds * 1000).format('s')

  const timeRemind = `${min} min ${sec} sec`
  const titleButton = +min > 0 ? `${min} ${min && 'min'}` : `${sec} ${sec && 'sec'}`

  return (
    <div className={`${styles.msg} ${styles.scheduledMeet}`} key={uidMsg}>
      <div className={styles.title}>Scheduled meeting with {name}</div>
      <div className={styles.date}>{moment(date).format('MMMM Do YYYY, h:mm')}</div>
      {seconds > 0 && <div className={styles.remainder}>After {timeRemind}</div>}
      <div className={styles.buttons}>
        <Button onClick={() => onCall(uid, uidMsg)} title="Call now" />
        {seconds > 0 && (
          <Button onClick={() => onRemind(date, name, uid, uidMsg, seconds)} title={`Remind after ${titleButton}`} />
        )}
      </div>
      <div className={styles.close} onClick={() => onRemove(date, uidMsg)}><CloseIcon /></div>
    </div>
  )
}
