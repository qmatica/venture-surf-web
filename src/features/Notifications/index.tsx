import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'common/types'
import { CloseIcon } from 'common/icons'
import { actions } from './actions'
import styles from './styles.module.sass'

export const Notifications = () => {
  const { messages } = useSelector((state: RootState) => state.notifications)
  const dispatch = useDispatch()
  const getClassName = (type: 'error' | 'warning' | 'success') => {
    switch (type) {
      case 'error': return styles.error
      case 'warning': return styles.warning
      case 'success': return styles.success
      default: return ''
    }
  }

  return (
    <div className={styles.container}>
      {messages.map((message) => (
        <div className={`${styles.messageContainer} ${getClassName(message.type)}`}>
          <div className={styles.message}>
            <div className={styles.title}>{message.title}</div>
            <div className={styles.value}>{message.value}</div>
          </div>
          <div className={styles.close} onClick={() => dispatch(actions.clearMessage(message))}>
            <CloseIcon />
          </div>
        </div>
      ))}
    </div>
  )
}
