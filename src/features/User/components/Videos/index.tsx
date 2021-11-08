import React, {
  createRef, FC, useEffect, useRef, useState
} from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperClassType from 'swiper/types/swiper-class'
import SwiperCore, { Navigation } from 'swiper'
import ReactHlsPlayer from 'react-hls-player'
import { Modal } from 'features/Modal'
import { StatisticVideoType, VideosType } from 'common/types'
import { usersAPI } from 'api'
import styles from './styles.module.sass'
import 'swiper/swiper-bundle.css'
import 'swiper/components/navigation/navigation.min.css'

SwiperCore.use([Navigation])

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
  const [formattedVideos, setFormattedVideos] = useState<VideoType[]>([])
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null)
  const [imagesIsReady, setImagesIsReady] = useState(false)

  useEffect(() => {
    const fv = videos._order_.map((video) => {
      const { playbackID } = videos[video]

      return {
        title: video,
        img: `https://image.mux.com/${playbackID}/thumbnail.jpg?time=5`,
        url: `https://stream.mux.com/${playbackID}.m3u8`,
        playbackID
      }
    })
    setFormattedVideos(fv)
    cacheImages(fv)
  }, [])

  const cacheImages = async (videos: VideoType[]) => {
    const promises = await videos.map((video) => new Promise((resolve, reject) => {
      const img = new Image()

      img.onload = () => resolve('loaded')
      img.onerror = () => reject()
      img.src = video.img
    }))

    await Promise.all(promises)

    setImagesIsReady(true)
  }

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
    setSelectedVideo(video)
    toggleModal()
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

  if (!imagesIsReady) {
    return null
  }

  return (
    <>
      <div className={styles.videosContainer}>
        <Swiper
          spaceBetween={20}
          slidesPerView="auto"
          onSlideChange={() => console.log('slide change')}
          navigation
          centerInsufficientSlides
        >
          {formattedVideos.map((video, index) => (
            <SwiperSlide key={video.url}>
              <div className={styles.videoContainer} onClick={() => openVideo(video)}>
                <div className={styles.imgContainer}>
                  <img src={video.img} alt={video.title} />
                </div>
                <div className={styles.title}>{video.title}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
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
