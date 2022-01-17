import React from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { Image } from 'common/components/Image'
import { UserIcon } from 'common/icons'
import { getChats, getOpenedChat } from 'features/Conversations/selectors'
import { actions } from 'features/Conversations/actions'
import styles from './styles.module.sass'

export const ChatsList = () => {
  const dispatch = useDispatch()

  const chats = useSelector(getChats)
  const openedChat = useSelector(getOpenedChat)

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer} />
      <div className={styles.listContainer}>
        {Object.values(chats).map(({
          name, photoUrl, photoBase64, messages, missedMessages, chat
        }) => {
          const activeClassName = chat === openedChat ? styles.activeDialog : ''

          const lastMessage = messages?.length ? messages[messages.length - 1] : null

          const dateLastMessage = lastMessage
            ? moment(lastMessage.dateUpdated).calendar(null, {
              lastDay: '[Yesterday]',
              sameDay: 'HH:mm',
              nextDay: '[Tomorrow]',
              lastWeek: '[last] dddd',
              nextWeek: 'dddd',
              sameElse: 'L'
            })
            : null

          return (
            <div
              className={`${styles.dialogItem} ${activeClassName}`}
              onClick={() => dispatch(actions.setOpenedChat(chat))}
              key={chat}
            >
              <div className={styles.imgContainer}>
                <Image
                  photoURL={photoUrl}
                  photoBase64={photoBase64}
                  alt={name}
                  userIcon={UserIcon}
                />
              </div>
              <div className={styles.bodyContainer}>
                <div className={styles.name}>{name}</div>
                {lastMessage && <div className={styles.lastMessage}>{lastMessage.body}</div>}
              </div>
              <div className={styles.notificationsContainer}>
                {dateLastMessage && (
                  <div className={styles.date}>
                    {dateLastMessage}
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
  )
}
