import React, { FC } from 'react'
import { useDispatch } from 'react-redux'
import { LikeIcon } from 'common/icons'
import { Tags } from 'common/components/Tags'
import Slider from 'react-slick'
import { industries, stages } from 'features/Profile/constants'
import { surfUser } from '../../types'
import styles from './styles.module.sass'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

interface IUser {
    user: surfUser
}

export const User: FC<IUser> = ({ user }) => {
  const dispatch = useDispatch()
  const name = user.displayName || `${user.first_name} ${user.last_name}`
  const settings = {
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  }
  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.imgContainer}>
          <img src={user.photoURL} alt={name} />
        </div>
        <div className={styles.aboutUserContainer}>
          {name && <div className={styles.name}>{name}</div>}
          {user.job?.company && <div className={styles.company}>{user.job?.company}</div>}
          {user.job?.headline && <div className={styles.headline}>{user.job?.headline}</div>}
          <div className={styles.likeButton}><LikeIcon /> Like</div>
        </div>
        <div className={styles.tagsContainer}>
          <Tags title="My startup is" tags={user.industries} dictionary={industries} edit={false} />
          <Tags title="My startup space is" tags={user.stages} dictionary={stages[user.activeRole]} edit={false} />
        </div>
      </div>
      <div className={styles.videosContainer}>
        <Slider {...settings}>
          <div>
            <div className={styles.imgContainer} />
          </div>
          <div>
            <div className={styles.imgContainer} />
          </div>
          <div>
            <div className={styles.imgContainer} />
          </div>
          <div>
            <div className={styles.imgContainer} />
          </div>
          <div>
            <div className={styles.imgContainer} />
          </div>
          <div>
            <div className={styles.imgContainer} />
          </div>
          <div>
            <div className={styles.imgContainer} />
          </div>
        </Slider>
      </div>
    </div>
  )
}
