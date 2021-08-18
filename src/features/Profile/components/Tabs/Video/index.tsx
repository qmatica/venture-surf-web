import React, {
  createRef, FC, useEffect, useState, useCallback, useMemo
} from 'react'
import ReactHlsPlayer from 'react-hls-player'
import { useDispatch } from 'react-redux'
import { ProfileType, VideoType } from 'features/Profile/types'
import { VideoItem } from 'features/Profile/components/Tabs/Video/components/VideoItem'
import { AddVideo } from 'features/Profile/components/Tabs/Video/components/AddVideo'
import styles from './styles.module.sass'

interface IVideo {
  profile: ProfileType
}

export const Video: FC<IVideo> = ({ profile }) => {
  const dispatch = useDispatch()
  const playerRef = createRef<HTMLVideoElement>()
  const [currentVideo, setCurrentVideo] = useState<VideoType | null>(null)

  const videos: [string, VideoType][] = useMemo(() => Object.entries(profile.videos), [profile.videos])

  useEffect(() => {
    if (videos.length > 0) {
      setCurrentVideo(videos[0][1])
    }
  }, [])

  useEffect(() => {
    if (currentVideo) {
      const updatedVideo = videos.find(([key, video]) => video.asset_id === currentVideo.asset_id)
      if (updatedVideo) setCurrentVideo(updatedVideo[1])
    }
    if (videos.length === 0) setCurrentVideo(null)
  }, [videos])

  const getVideoPlayer = useCallback(() => (
    <>
      {currentVideo && (
      <ReactHlsPlayer
        playerRef={playerRef}
        src={currentVideo.encoding_url}
        autoPlay
        controls
      />
      )}
    </>
  ), [currentVideo?.encoding_url])

  return (
    <div className={styles.container}>
      <div className={styles.profileVideoContainer}>
        <AddVideo />
        <div className={styles.playListContainer}>
          {videos.map(([key, video]) => (
            <VideoItem
              key={video.asset_id}
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
          <div className={styles.time}>{currentVideo.duration_secs}s</div>
          <div className={styles.description}>
            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum.
          </div>
        </div>
        )}
      </div>
    </div>
  )
}
