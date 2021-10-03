import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { Chat } from './components/Chat'
import { Welcome } from './components/Welcome'
import { getChats } from './selectors'
import styles from './styles.module.sass'

export const Conversations: FC = () => {
  const chats = useSelector(getChats)

  return (
    <div className={styles.container}>
      {Object.values(chats).length ? <Chat /> : <Welcome />}
    </div>
  )
}
