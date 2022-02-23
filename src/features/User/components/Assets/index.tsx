import React, { FC } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getMyProfile } from 'features/Profile/selectors'
import { UserIcon } from 'common/icons'
import { UserType } from 'features/User/types'
import { Image } from 'common/components/Image'
import { addYourself } from 'features/Surf/actions'
import { profileInteractionUsers } from 'features/Profile/constants'
import { Link } from 'react-router-dom'
import styles from './styles.module.sass'

interface IAssets {
  user: UserType
  selectedRole: 'founder' | 'investor'
  onClick: () => void
  relatedUsersList: UserType[]
}

export const Assets: FC<IAssets> = ({
  user, selectedRole, onClick, relatedUsersList
}) => {
  const dispatch = useDispatch()
  const myProfile = useSelector(getMyProfile)
  const canInteract =
    !relatedUsersList.some(
      (relatedUser) => relatedUser.uid === myProfile?.uid
    ) && myProfile?.activeRole !== selectedRole

  return relatedUsersList.length || canInteract ? (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>{selectedRole === 'investor' ? 'Investments' : 'Backed by '}</div>
        <div className={styles.linkContainer}>
          {canInteract && (
            <div
              className={styles.link}
              onClick={() =>
                dispatch(
                  addYourself(user.uid, profileInteractionUsers.content[selectedRole])
                )}
            >Add yourself
            </div>
          )}
          {relatedUsersList.length > 2 && <div className={styles.link} onClick={onClick}>See all</div>}
        </div>
      </div>
      <div className={styles.users}>
        {relatedUsersList.slice(0, 2).map((relatedUser) => (
          <div key={relatedUser.uid} className={styles.user}>
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
          </div>
        ))}
      </div>
    </div>
  ) : null
}
