import React, { FC, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal } from 'features/Modal'
import { Button } from 'common/components/Button'
import welcomeToConversations from 'common/images/welcomeToConversations.jpg'
import { useSelector } from 'react-redux'
import { getMutuals } from 'features/Contacts/selectors'
import styles from './styles.module.sass'

export const Welcome: FC = () => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const history = useHistory()

  const mutuals = useSelector(getMutuals)

  const toggleModal = () => setIsOpenModal(!isOpenModal)

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <img src={welcomeToConversations} alt="Welcome to conversations" />
        <h3>Welcome to conversations</h3>
        <div className={styles.title}>You can chat, share your deck and even video chat here</div>
        <Button
          title="Start a conversation"
          className={styles.startConversation}
          onClick={() => history.push('/contacts')}
        />
      </div>
      {/*<Modal isOpen={isOpenModal} onClose={toggleModal} title="Pick a person">
        <>
          {mutuals?.map((mutual) => {
            const name = mutual.name || mutual.displayName || `${mutual.first_name} ${mutual.last_name}`

            return (
              <div>{name}</div>
            )
          })}
        </>
      </Modal>*/}
    </div>

  )
}
