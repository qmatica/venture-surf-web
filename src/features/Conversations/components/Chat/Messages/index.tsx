import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import {
  ArrowBottomIcon, NotReadMessageIcon, ReadMessageIcon
} from 'common/icons'
import { ContextMenu, ContextMenuTrigger } from 'react-contextmenu'
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

            return (
              <div className={`${styles.messageWrapper} ${className}`} key={message.sid}>
                <div className={styles.messageContainer}>
                  <div className={styles.body}>{message.body}</div>
                  <div className={styles.date}>{moment(message.dateUpdated).format('HH:mm')}</div>
                  {myMessage && (
                  <div className={styles.readStatus}>
                    {message.aggregatedDeliveryReceipt ? <ReadMessageIcon /> : <NotReadMessageIcon />}
                  </div>
                  )}
                  <span>
                    <ContextMenuTrigger id="contextMenuMessage" holdToDisplay={0}>
                      <div>
                        <ArrowBottomIcon />
                      </div>
                    </ContextMenuTrigger>
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        <ContextMenu id="contextMenuMessage" className={styles.contextMenuMessage}>
          <div className={styles.item}>Edit</div>
          <div className={styles.item}>Delete</div>
        </ContextMenu>
      </div>
      <InputField scrollToBottom={scrollToBottom} />
    </div>
  )
}
