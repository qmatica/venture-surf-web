import React, { useState } from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { getImageSrcFromBase64 } from 'common/utils'
import styles from './styles.module.sass'
import { actions } from '../../../actions'
import { getChats, getOpenedChat } from '../../../selectors'
import { UserIcon, LoadingSkeleton } from '../../../../../common/icons'

export const ChatsList = () => {
  const dispatch = useDispatch()

  const chats = useSelector(getChats)
  const openedChat = useSelector(getOpenedChat)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer} />
      <div className={styles.listContainer}>
        {Object.values(chats).map(({
          name, photoUrl, photoBase64, messages, missedMessages, chat
        }) => {
          if (!photoUrl && !photoBase64 && !isImageLoaded) setIsImageLoaded(true)
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
                {!isImageLoaded && <div><LoadingSkeleton /></div>}
                {photoUrl || photoBase64
                  ? (
                    <img
                      className={`${styles.photo} ${isImageLoaded ? styles.visible : styles.hidden}`}
                      src={getImageSrcFromBase64(photoBase64, photoUrl)}
                      alt={name}
                      onLoad={() => !isImageLoaded && setIsImageLoaded(true)}
                    />
                  )
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
