import React, {
  createRef, FC, useEffect, useState
} from 'react'
import Slider from 'react-slick'
import ReactHlsPlayer from 'react-hls-player'
import { Modal } from 'features/Modal'
import { StatisticVideoType, VideosType } from 'common/types'
import { usersAPI } from 'api'
import styles from './styles.module.sass'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

type VideoType = {
    title: string,
    img: string,
    url: string,
    playbackID: string
}

interface IVideos {
    videos?: VideosType
    userId: string
    userName: string
}

const statisticVideo = {
  exitedFromPlaylist: 'exitedFromPlaylist',
  clickedToNext: 'clickedToNext',
  fullView: 'fullView'
} as const

export const Videos: FC<IVideos> = ({
  videos,
  userId,
  userName
}) => {
  if (!videos) return null

  const playerRef = createRef<HTMLVideoElement>()
  const [formattedVideos, setFormattedVideos] = useState<(VideoType | null)[]>([])
  const [isSliding, setIsSliding] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null)

  useEffect(() => {
    const fv = videos._order_.reduce((prevVideos: (VideoType | null)[], nextVideo, index, array) => {
      const { playbackID } = videos[nextVideo]

      const video = {
        title: nextVideo,
        img: `https://image.mux.com/${playbackID}/thumbnail.jpg?time=5`,
        url: `https://stream.mux.com/${playbackID}.m3u8`,
        playbackID
      }

      // generate empty carts for carousel videos
      if (index === array.length - 1) {
        let emptyVideos
        if (index === 0) {
          emptyVideos = [null, null]
        }
        if (index === 1) {
          emptyVideos = [null]
        }
        if (emptyVideos) return [...prevVideos, video, ...emptyVideos]
      }

      return [...prevVideos, video]
    }, [])
    setFormattedVideos(fv)
  }, [])

  const startSliding = () => setIsSliding(true)

  const stopSliding = () => setIsSliding(false)

  const toggleModal = () => {
    setIsOpenModal(!isOpenModal)
    if (selectedVideo) {
      setSelectedVideo(null)

      if (playerRef.current) {
        const { duration, currentTime } = playerRef.current

        if (formattedVideos[formattedVideos.length - 1]?.playbackID === selectedVideo.playbackID
          && currentTime === duration) {
          return
        }
        sendStatisticVideo(statisticVideo.exitedFromPlaylist)
      }
    }
  }
  const openVideo = (video: VideoType) => {
    if (!isSliding) {
      setSelectedVideo(video)
      toggleModal()
    }
  }

  const onSetSelectedVideo = (video: VideoType) => {
    sendStatisticVideo(statisticVideo.clickedToNext)
    setSelectedVideo(video)
  }

  const onEndedVideo = () => {
    sendStatisticVideo(statisticVideo.fullView)

    const videoIndex = formattedVideos.findIndex((video) => video?.playbackID === selectedVideo?.playbackID)

    if (videoIndex !== -1) {
      const nextVideo = formattedVideos[videoIndex + 1]

      if (nextVideo) {
        setSelectedVideo(nextVideo)
      }
    }
  }

  const sendStatisticVideo = (action: 'exitedFromPlaylist' | 'clickedToNext' | 'fullView') => {
    if (selectedVideo) {
      if (playerRef.current) {
        const { duration, currentTime } = playerRef.current

        const statistic: StatisticVideoType = {
          stop_time: currentTime,
          percent: Math.round((currentTime / duration) * 100),
          action
        }

        console.log('user uid: ', userId)
        console.log('playbackID: ', selectedVideo.playbackID)
        console.log('stop_time: ', currentTime)
        console.log('percent: ', Math.round((currentTime / duration) * 100))
        console.log('action: ', action)

        usersAPI.sendStatisticVideo(userId, selectedVideo.playbackID, statistic)
      }
    }
  }

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
                  <div className={`${styles.videoContainer} ${styles.empty}`}>
                    <div className={styles.imgContainer} />
                  </div>
                </div>
              )
            }
            return (
              <div key={video.url}>
                <div className={styles.videoContainer} onClick={() => openVideo(video)}>
                  <div className={`${styles.imgContainer} ${styles.withVideo}`}>
                    {video.img && (
                      <div
                        className={styles.overlayCover}
                        style={{
                          backgroundImage: `url(${video.img})`
                        }}
                      />
                    )}
                    <img src={video.img} alt={video.title} />
                  </div>
                  <div className={styles.title}>{video.title}</div>
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
                onEnded={onEndedVideo}
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
                  onClick={() => onSetSelectedVideo(video)}
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
