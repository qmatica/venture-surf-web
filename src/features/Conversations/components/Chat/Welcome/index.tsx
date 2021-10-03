import React from 'react'
import welcomeToConversations from 'common/images/welcomeToConversations.jpg'
import styles from './styles.module.sass'

export const Welcome = () => (
  <div className={styles.container}>
    <img src={welcomeToConversations} alt="Welcome to conversations" />
    <h3>Welcome to conversations</h3>
    <div>
      You can chat, share your deck and even video chat here.
      Pick a person from left menu.
    </div>
  </div>
)
