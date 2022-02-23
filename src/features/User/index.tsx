import React, { FC, memo, useState } from 'react'
import { Modal } from 'features/Modal'
import { profileInteractionUsers } from 'features/Profile/constants'
import { Image } from 'common/components/Image'
import { UserIcon } from 'common/icons'
import { Link } from 'react-router-dom'
import { SwitchRoles } from './components/SwitchRoles'
import { Body } from './components/Body'
import { Actions } from './components/Actions'
import { Videos } from './components/Videos'
import { Tags } from './components/Tags'
import { Assets } from './components/Assets'
import { UserType } from './types'
import { Recommendations } from './components/Recommendations'
import styles from './styles.module.sass'

interface IUser {
    user: UserType
    rightSide?: 'tags' | 'assets'
    viewActions?: boolean
    viewVideos?: boolean
    switchRoles?: boolean
    typeUser: 'mutuals' | 'received' | 'sent' | 'surf'
    isRecommended?: boolean
}

export const User: FC<IUser> = memo(({
  user,
  rightSide,
  viewActions = false,
  viewVideos = false,
  switchRoles = false,
  typeUser,
  isRecommended = false
}) => {
  const [selectedRole, setSelectedRole] = useState<'founder' | 'investor'>(user.activeRole)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const toggleModal = () => setIsOpenModal(!isOpenModal)
  const invests = user[profileInteractionUsers.content[selectedRole]]
  const relatedUsersList = user.mutuals ? Object.values(user.mutuals).filter((mutual) => invests?.[mutual.uid]) : []
  const name = user.name || user.displayName || `${user.first_name} ${user.last_name}`

  let rightSideContent
  switch (rightSide) {
    case 'tags': {
      rightSideContent = (
        <Tags
          tags={user.tags}
          stages={user.stages}
          industries={user.industries}
          activeRole={user.activeRole}
        />
      )
      break
    }
    case 'assets': {
      rightSideContent = (
        <Assets
          user={user}
          selectedRole={selectedRole}
          onClick={toggleModal}
          relatedUsersList={relatedUsersList}
        />
      )
      break
    }
    default:
      break
  }

  return (
    <div className={styles.container}>
      {isRecommended && <Recommendations user={user} />}
      {switchRoles && (
        <SwitchRoles
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          roles={user.roles}
        />
      )}
      <Body
        user={user}
        rightSide={rightSideContent}
        typeUser={typeUser}
        isRecommended={isRecommended}
      />
      {viewActions && <Actions user={user} userName={name} />}
      {viewVideos && (
        <Videos
          videos={user.content?.videos}
          userId={user.uid}
          userName={name}
        />
      )}
      <Modal
        title={selectedRole === 'investor' ? 'Investments' : 'Backed by '}
        isOpen={isOpenModal}
        onClose={toggleModal}
      >
        <div className={styles.modalContainer}>
          {relatedUsersList.map((relatedUser) => (
            <div key={relatedUser.uid}>
              <div className={styles.user}>
                <div className={styles.userPhoto}>
                  <Image
                    photoURL={relatedUser.photoURL}
                    photoBase64={relatedUser.photoBase64}
                    alt={relatedUser.displayName}
                    userIcon={UserIcon}
                  />
                </div>
                <Link to={`/profile/${relatedUser.uid}`}>
                  <div>{relatedUser.displayName}</div>
                </Link>
                <div className={styles.status}>{invests?.[relatedUser.uid].status}</div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
})
