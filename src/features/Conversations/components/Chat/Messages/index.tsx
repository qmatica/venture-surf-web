import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import {
  ArrowBottomIcon, NotReadMessageIcon, ReadMessageIcon
} from 'common/icons'
import { getMyUid } from 'features/Auth/selectors'
import { getChats, getOpenedChat } from '../../../selectors'
import { InputField } from './InputField'
import styles from './styles.module.sass'

export const Messages = () => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)

  const [prevScrollHeightMessagesContainer, setPrevScrollHeightMessagesContainer] = useState(0)

  const uid = useSelector(getMyUid)
  const chats = useSelector(getChats)
  const openedChat = useSelector(getOpenedChat)
  const viewDays = [] as string[]

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
  }, [chats[openedChat]?.messages.length])

  const scrollToBottom = () => messagesContainerRef.current?.scrollTo(0, messagesContainerRef.current.scrollHeight)

  const getDayMessage = (dateUpdated: Date) => {
    const day = moment(dateUpdated).calendar(null, {
      lastDay: '[Yesterday]',
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      lastWeek: '[last] dddd',
      nextWeek: 'dddd',
      sameElse: 'L'
    })
    if (!viewDays.includes(day)) {
      viewDays.push(day)
      return day
    }
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>{chats[openedChat] && chats[openedChat].name}</div>
      <div className={styles.messagesWrapper}>
        <div
          className={styles.messagesContainer}
          ref={messagesContainerRef}
          style={{ height: openedChat && chats[openedChat] ? 'auto' : '100%' }}
        >
          {chats[openedChat].messages.map((message) => {
            const myMessage = message.author === uid

            const className = myMessage ? styles.ownerMessage : styles.otherOwnerMessage

            const dayMessage = getDayMessage(message.dateUpdated)

            return (
              <React.Fragment key={message.sid}>
                {dayMessage && (
                  <div className={styles.dayContainer}>
                    <div className={styles.day}>{dayMessage}</div>
                  </div>
                )}
                <div className={`${styles.messageWrapper} ${className}`}>
                  <div className={styles.messageContainer}>
                    <div className={styles.body}>{message.body}</div>
                    <div className={styles.date}>{moment(message.dateUpdated).format('HH:mm')}</div>
                    {myMessage && (
                    <div className={styles.readStatus}>
                      {message.aggregatedDeliveryReceipt ? <ReadMessageIcon /> : <NotReadMessageIcon />}
                    </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            )
          })}
        </div>
      </div>
      <InputField scrollToBottom={scrollToBottom} />
    </div>
  )
}
