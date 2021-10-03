import React from 'react'
import { useSelector } from 'react-redux'
import { ChatsList } from './ChatsList'
import { Messages } from './Messages'
import { getChats, getOpenedChat } from '../../selectors'
import { Welcome } from './Welcome'
import styles from './styles.module.sass'

export const Chat = () => {
  const chats = useSelector(getChats)
  const openedChat = useSelector(getOpenedChat)

  return (
    <div className={styles.container}>
      <ChatsList />
      {openedChat && chats[openedChat] ? <Messages /> : <Welcome />}
    </div>
  )
}
