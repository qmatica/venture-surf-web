import React, { FC, useState } from 'react'
import { UserIcon } from 'common/icons'
import { UserType } from 'features/User/types'
import { profileInteractionUsers } from 'features/Profile/constants'
import { Image } from 'common/components/Image'
import { Modal } from 'features/Modal'
import { UserRow } from 'features/Profile/components/Tabs/About/components/UserRow'
import { ProfileType } from 'features/Profile/types'
import styles from './styles.module.sass'

interface IAssets {
  user: UserType
  selectedRole: 'founder' | 'investor'
}

export const Assets: FC<IAssets> = ({ user, selectedRole }) => {
  const investments = user[profileInteractionUsers.content[selectedRole]]
  const relatedUsersList = user.mutuals ? Object.values(user.mutuals).filter((mutual) => investments[mutual.uid]) : []

  const [isOpenModal, setIsOpenModal] = useState(false)
  const toggleModal = () => setIsOpenModal(!isOpenModal)

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>{selectedRole === 'investor' ? 'Investments' : 'Backed by '}</div>
          {relatedUsersList.length > 1 && <div className={styles.link} onClick={toggleModal}>See all</div>}
        </div>
        <div className={styles.users}>
          {relatedUsersList.map((relatedUser, index) => {
            if (index > 1) return null
            return (
              <div key={relatedUser.uid} className={styles.user}>
                <div className={styles.userPhoto}>
                  <Image
                    photoURL={relatedUser.photoURL}
                    photoBase64={relatedUser.photoBase64}
                    alt={relatedUser.displayName}
                    userIcon={UserIcon}
                  />
                </div>
                <div>{relatedUser.displayName}</div>
              </div>
            )
          })}
        </div>
      </div>
      <Modal
        title={selectedRole === 'investor' ? 'Investments' : 'Backed by '}
        isOpen={isOpenModal}
        onClose={toggleModal}
      >
        <div className={`${styles.container} ${styles.modalContainer}`}>
          {relatedUsersList.map((relatedUser) => (
            <div key={relatedUser.uid} className={styles.users}>
              <div className={styles.user}>
                <div className={styles.userPhoto}>
                  <Image
                    photoURL={relatedUser.photoURL}
                    photoBase64={relatedUser.photoBase64}
                    alt={relatedUser.displayName}
                    userIcon={UserIcon}
                  />
                </div>
                <div>{relatedUser.displayName}</div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  )
}
