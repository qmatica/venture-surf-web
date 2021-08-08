import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'common/types'
import { CloseIcon } from 'common/icons'
import { actions } from './actions'
import styles from './styles.module.sass'

export const Notifications = () => {
  const { messages } = useSelector((state: RootState) => state.notifications)
  const dispatch = useDispatch()
  return (
    <div className={styles.container}>
      {messages.map((message) => (
        <div className={styles.message}>
          <div>
            {message}
          </div>
          <div className={styles.close} onClick={() => dispatch(actions.clearMessage(message))}>
            <CloseIcon />
          </div>
        </div>
      ))}
    </div>
  )
}
