import React, { createRef, FC, useState } from 'react'
import Slider from 'react-slick'
import ReactHlsPlayer from 'react-hls-player'
import { Modal } from 'features/Modal'
import { VideosType } from 'common/types'
import styles from './styles.module.sass'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

type VideoType = {
    title: string,
    img: string,
    url: string
}

interface IVideos {
    videos?: VideosType
    userId: string
    userName: string
}

export const Videos: FC<IVideos> = ({
  videos,
  userId,
  userName
}) => {
  if (!videos) return null

  const [isSliding, setIsSliding] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null)
  const playerRef = createRef<HTMLVideoElement>()
  const startSliding = () => setIsSliding(true)
  const stopSliding = () => setIsSliding(false)
  const toggleModal = () => setIsOpenModal(!isOpenModal)
  const openVideo = (video: VideoType) => {
    if (!isSliding) {
      setSelectedVideo(video)
      toggleModal()
    }
  }

  const formattedVideos = videos._order_.reduce((prevVideos: (VideoType | null)[], nextVideo, index, array) => {
    const playbackID = videos[nextVideo]
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

  return (
    <>
      <div className={styles.videosContainer}>
        <Slider {...settingsSlider}>
          {formattedVideos.map((video, index) => {
            if (!video) {
              return (
                <div key={`${userId} ${index}`}>
                  <div className={styles.imgContainer} />
                </div>
              )
            }
            return (
              <div key={video.url}>
                <div className={styles.imgContainer} onClick={() => openVideo(video)}>
                  <img src={video.img} alt={video.title} />
                </div>
              </div>
            )
          })}
        </Slider>
      </div>
      <Modal title={`Video: ${userName} - ${selectedVideo?.title}`} isOpen={isOpenModal} onClose={toggleModal} width={935}>
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
            {formattedVideos.map((video) => {
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
    </>
  )
}
