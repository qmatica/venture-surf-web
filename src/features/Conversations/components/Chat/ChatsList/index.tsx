import React from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import styles from './styles.module.sass'
import { actions } from '../../../actions'
import { getChats, getOpenedChat } from '../../../selectors'
import { UserIcon } from '../../../../../common/icons'

export const ChatsList = () => {
  const dispatch = useDispatch()

  const chats = useSelector(getChats)
  const openedChat = useSelector(getOpenedChat)

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer} />
      <div className={styles.listContainer}>
        {Object.values(chats).map(({
          name, photoUrl, messages, missedMessages, chat
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
                {photoUrl
                  ? <img className={styles.photo} src={photoUrl} alt={name} />
                  : <div className={styles.noPhoto}><UserIcon /></div>}
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
