import React, {
  createRef, FC, useEffect, useState, useCallback, useMemo
} from 'react'
import ReactHlsPlayer from 'react-hls-player'
import { useDispatch } from 'react-redux'
import { ProfileType } from 'features/Profile/types'
import { VideoItem } from 'features/Profile/components/Tabs/Video/components/VideoItem'
import { AddVideo } from 'features/Profile/components/Tabs/Video/components/AddVideo'
import styles from './styles.module.sass'

interface IVideo {
  profile: ProfileType
  isOnlyView: boolean
}

export type FormattedVideoType = {
  title: string,
  img: string,
  url: string,
  assetID: string
  playbackID: string
  created_at: number
}

export const Video: FC<IVideo> = ({ profile, isOnlyView }) => {
  const dispatch = useDispatch()
  const playerRef = createRef<HTMLVideoElement>()
  const [currentVideo, setCurrentVideo] = useState<FormattedVideoType | null>(null)

  const uploadingVideos = useMemo(() => profile[profile.activeRole].videos._uploading_.map((video) => ({
    title: video,
    img: '',
    url: '',
    assetID: '',
    playbackID: '',
    created_at: 1234567
  })), [profile[profile.activeRole].videos._uploading_])

  const videos = useMemo(() => profile[profile.activeRole].videos._order_
    .map((video) => {
      const { playbackID, assetID, created_at } = profile[profile.activeRole].videos[video]

      return {
        title: video,
        img: `https://image.mux.com/${playbackID}/thumbnail.jpg?time=5`,
        url: `https://stream.mux.com/${playbackID}.m3u8`,
        assetID,
        playbackID,
        created_at
      }
    }), [profile[profile.activeRole].videos._order_])

  useEffect(() => {
    if (videos.length > 0) {
      setCurrentVideo(videos[0])
    }
  }, [])

  useEffect(() => {
    if (currentVideo) {
      const updatedVideo = videos.find((video) => video.assetID === currentVideo.assetID)
      if (updatedVideo) setCurrentVideo(updatedVideo)
    }
    if (videos.length === 0) setCurrentVideo(null)
  }, [videos])

  const getVideoPlayer = useCallback(() => (
    <>
      {currentVideo && (
      <ReactHlsPlayer
        playerRef={playerRef}
        src={currentVideo.url}
        autoPlay
        controls
      />
      )}
    </>
  ), [currentVideo?.url])

  return (
    <div className={styles.container}>
      <div className={styles.profileVideoContainer}>
        {!isOnlyView && <AddVideo />}
        <div className={styles.playListContainer}>
          {uploadingVideos.map((video, i) => (
            <VideoItem
              key={`${video} ${i}`}
              video={video}
              activeVideoInPlayer={currentVideo}
              onSetCurrentVideo={setCurrentVideo}
            />
          ))}
          {videos.map((video) => (
            <VideoItem
              key={video.url}
              video={video}
              activeVideoInPlayer={currentVideo}
              onSetCurrentVideo={setCurrentVideo}
            />
          ))}
        </div>
      </div>
      <div className={styles.playerContainer}>
        <div
          className={styles.player}
          style={{
            border: currentVideo ? 'none' : '2px solid #e5eefe',
            height: currentVideo ? '100%' : '363px'
          }}
        >
          {getVideoPlayer()}
        </div>
        {currentVideo && (
        <div className={styles.infoContainer}>
          <div className={styles.title}>{currentVideo.title}</div>
          <div className={styles.description}>
            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia
            non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad
            minima veniam, quis nostrum.
          </div>
        </div>
        )}
      </div>
    </div>
  )
}
