import React, { FC, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SendMessageIcon } from 'common/icons'
import { sendMessage } from '../../../../actions'
import { getOpenedChat } from '../../../../selectors'
import styles from './styles.module.sass'

interface IInputField {
  scrollToBottom: () => void
}

export const InputField: FC<IInputField> = ({ scrollToBottom }) => {
  const dispatch = useDispatch()

  const openedChat = useSelector(getOpenedChat)

  const [message, setMessage] = useState('')

  const onMessageChanged = (e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()

    const trimMessage = message.trim()

    if (!trimMessage) return

    scrollToBottom()

    dispatch(sendMessage(trimMessage, openedChat))

    setMessage('')
  }

  return (
    <div className={styles.container}>
      <form onSubmit={onSubmit}>
        <div className={styles.textInputContainer}>
          <input
            value={message}
            className={styles.textInput}
            type="text"
            placeholder="Type message"
            onChange={onMessageChanged}
          />
        </div>
        <button type="submit" className={styles.sendMessageButton}>
          <SendMessageIcon />
        </button>
      </form>
    </div>
  )
}
