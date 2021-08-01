import React, { createRef, FC, useState } from 'react'
import { useDispatch } from 'react-redux'
import { LikeIcon } from 'common/icons'
import { Tags } from 'common/components/Tags'
import Slider from 'react-slick'
import { industries, stages } from 'features/Profile/constants'
import { Modal } from 'features/Modal'
import ReactHlsPlayer from 'react-hls-player'
import { surfUser } from '../../types'
import styles from './styles.module.sass'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

type VideoType = {
  title: string,
  img: string,
  url: string
}

interface IUser {
    user: surfUser
}

export const User: FC<IUser> = ({ user }) => {
  const dispatch = useDispatch()
  const playerRef = createRef<HTMLVideoElement>()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isSliding, setIsSliding] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null)

  const name = user.displayName || `${user.first_name} ${user.last_name}`

  const startSliding = () => setIsSliding(true)
  const stopSliding = () => setIsSliding(false)

  const settingsSlider = {
    arrows: true,
    infinite: false,
    swipeToSlide: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    beforeChange: startSliding,
    afterChange: stopSliding
  }

  const videos = user.content.videos._order_.reduce((prevVideos: (VideoType | null)[], nextVideo, index, array) => {
    const playbackID = user.content.videos[nextVideo]
    const video = {
      title: nextVideo,
      img: `https://image.mux.com/${playbackID}/thumbnail.jpg?time=5`,
      url: `https://stream.mux.com/${playbackID}.m3u8`
    }

    // generate empty carts for carousel videos
    if (index === array.length - 1) {
      let emptyVideos
      if (index === 0) {
        emptyVideos = [null, null]
      }
      if (index === 1) {
        emptyVideos = null
      }
      if (emptyVideos) return [...prevVideos, video, ...emptyVideos]
    }

    return [...prevVideos, video]
  }, [])

  const openModal = (video: VideoType) => {
    if (!isSliding) {
      setSelectedVideo(video)
      toggleModal()
    }
  }

  const toggleModal = () => setIsOpenModal(!isOpenModal)

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
          <Tags title="My startup is" tags={user.industries} dictionary={industries} />
          <Tags title="My startup space is" tags={user.stages} dictionary={stages[user.activeRole]} />
        </div>
      </div>
      <div className={styles.videosContainer}>
        <Slider {...settingsSlider}>
          {videos.map((video, index) => {
            if (!video) {
              return (
                <div key={`${user.uid} ${index}`}>
                  <div className={styles.imgContainer} />
                </div>
              )
            }
            return (
              <div key={video.url}>
                <div className={styles.imgContainer} onClick={() => openModal(video)}>
                  <img src={video.img} alt={video.title} />
                </div>
              </div>
            )
          })}
        </Slider>
      </div>
      <Modal title={selectedVideo?.title} isOpen={isOpenModal} onClose={toggleModal} width={935}>
        <div className={styles.videoPlayerContainer}>
          {selectedVideo && (
            <div className={styles.player}>
              <ReactHlsPlayer
                playerRef={playerRef}
                src={selectedVideo.url}
                autoPlay
                controls
              />
            </div>
          )}
          <div className={styles.playList}>
            {videos.map((video, index) => {
              if (!video) return null
              return (
                <div
                  key={video.url}
                  className={`${styles.item} ${selectedVideo?.url === video.url ? styles.active : ''}`}
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className={styles.imgContainer}>
                    <img src={video.img} alt={video.title} />
                  </div>
                  <div>{video.title}</div>
                </div>
              )
            })}
          </div>
        </div>
      </Modal>
    </div>
  )
}
