import React, { FC } from 'react'
import ReactTooltip from 'react-tooltip'
import { UserPhotoIcon } from 'common/icons'
import { Image } from 'common/components/Image'
import { Link } from 'react-router-dom'
import styles from './styles.module.sass'
import { UserType } from '../../types'

interface IRecommendations {
  user: UserType
}

export const Recommendations: FC<IRecommendations> = ({ user }) => {
  const name = user.name || user.displayName || `${user.first_name} ${user.last_name}`

  return (
    <div className={styles.container}>
      <ReactTooltip />
      <div className={styles.title}>Recommended by:</div>
      <div className={styles.recommendedUsersContainer}>
        {user.recommendedByList.map((u) => (
          <Link to={`profile/${u.uid}`} key={`${user.uid}-${u.uid}`}>
            <div
              className={styles.photoContainer}
              data-tip={u.message}
              data-place="bottom"
              data-effect="solid"
            >
              <Image
                photoURL={u.photoURL}
                photoBase64={u.photoBase64}
                alt={name}
                userIcon={UserPhotoIcon}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
