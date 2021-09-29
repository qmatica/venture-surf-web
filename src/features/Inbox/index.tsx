import moment from 'moment'
import {
  NotReadMessageIcon, PapersDialogIcon, ReadMessageIcon, SendMessageIcon
} from 'common/icons'
import React, {
  FC, useEffect, useRef, useState
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'common/types'
import styles from './styles.module.sass'
import { init, sendMessage } from './actions'
import { getChats } from './selectors'

export const Inbox: FC = () => {
  const dispatch = useDispatch()

  const messagesContainerRef = useRef<HTMLDivElement | null>(null)

  const chats = useSelector(getChats)
  const { auth } = useSelector((state: RootState) => state.firebase)

  const [activeChat, setActiveChat] = useState<string>('')
  const [prevScrollHeightMessagesContainer, setPrevScrollHeightMessagesContainer] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    dispatch(init())
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [activeChat])

  useEffect(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, offsetHeight, scrollHeight } = messagesContainerRef.current

      if (prevScrollHeightMessagesContainer !== scrollHeight) {
        setPrevScrollHeightMessagesContainer(scrollHeight)

        if (prevScrollHeightMessagesContainer - offsetHeight - scrollTop === 0) {
          scrollToBottom()
        }
      }
    }
  }, [chats[activeChat]?.messages.length])

  const onMessageChanged = (e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)

  const scrollToBottom = () => messagesContainerRef.current?.scrollTo(0, messagesContainerRef.current.scrollHeight)

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (!message) return

    scrollToBottom()

    dispatch(sendMessage(message, activeChat))

    setMessage('')
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftSideContainer}>
        <div className={styles.dialogsHeader} />
        <div className={styles.dialogsContainer}>
          {Object.entries(chats).map(([key, value]) => {
            const {
              name, photoUrl, messages, missedMessages
            } = value

            const activeClassName = key === activeChat ? styles.activeDialog : ''

            const lastMessage = messages.length ? messages[messages.length - 1] : null

            return (
              <div
                className={`${styles.dialogItem} ${activeClassName}`}
                onClick={() => setActiveChat(key)}
                key={key}
              >
                <div className={styles.imgContainer}>
                  {photoUrl
                    ? <img className={styles.photo} src={photoUrl} alt={name} />
                    : <div className={styles.noPhoto} />}
                </div>
                <div className={styles.bodyContainer}>
                  <div className={styles.name}>{name}</div>
                  {lastMessage && <div className={styles.lastMessage}>{lastMessage.body}</div>}
                </div>
                <div className={styles.notificationsContainer}>
                  {lastMessage && (
                    <div className={styles.date}>
                      {moment(new Date(lastMessage.date_created)).format('HH:mm')}
                    </div>
                  )}
                  {missedMessages > 0 && (
                    <div className={styles.missedMessagesContainer}>
                      <div className={styles.missedMessages}>{missedMessages}</div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className={styles.rightSideContainer}>
        <div className={styles.dialogHeaderContainer}>{activeChat && chats[activeChat].name}</div>
        <div className={styles.dialogBodyContainer}>
          <div className={styles.messagesContainer} ref={messagesContainerRef}>
            {activeChat
              ? chats[activeChat].messages.map((message) => {
                const myMessage = message.author === auth.uid

                const className = myMessage ? styles.ownerMessage : styles.otherOwnerMessage

                return (
                  <div className={`${styles.messageWrapper} ${className}`} key={message.sid}>
                    <div className={styles.messageContainer}>
                      <div className={styles.body}>{message.body}</div>
                      <div className={styles.date}>{moment(new Date(message.date_created)).format('HH:mm')}</div>
                      {myMessage && (
                        <div className={styles.readStatus}>
                          {message.notRead ? <NotReadMessageIcon /> : <ReadMessageIcon />}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
              : (
                <div className={styles.papersInDialog}>
                  <PapersDialogIcon />
                </div>
              )}
          </div>
        </div>
        {activeChat && (
          <div className={styles.dialogFooterContainer}>
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
        )}
      </div>
    </div>
  )
}
