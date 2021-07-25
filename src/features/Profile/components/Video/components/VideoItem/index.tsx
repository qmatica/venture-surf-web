import React, { FC } from 'react'
import { Edit2Icon, TimeIcon } from 'common/icons'
import { VideoType } from 'features/Profile/types'
import { Modal } from 'features/Modal'
import { useDispatch } from 'react-redux'
import { actions as actionsModal } from 'features/Modal/actions'
import { IFormElement, SetNameVideo } from 'features/Profile/components/Video/components/SetNameVideo'
import { deleteVideo, renameVideo } from 'features/Profile/actions'
import styles from './styles.module.sass'

interface IVideoItem {
    video: VideoType
    currentVideo: VideoType | null
    setCurrentVideo: (video: VideoType) => void
    modalName: string
}

export const VideoItem: FC<IVideoItem> = ({
  video,
  currentVideo,
  setCurrentVideo,
  modalName
}) => {
  const dispatch = useDispatch()

  const openModal = () => {
    dispatch(actionsModal.openModal(modalName))
  }

  const handleSubmit = (e: React.FormEvent<IFormElement>) => {
    e.preventDefault()
    dispatch(renameVideo(video.asset_id, video.title, e.currentTarget.elements.videoName.value, modalName))
  }

  const selectVideo = () => setCurrentVideo(video)

  return (
    <>
      <div
        className={`${styles.videoContainer} ${currentVideo?.asset_id === video.asset_id ? styles.active : ''}`}
        title={video.title}
      >
        <div className={styles.imgContainer} onClick={selectVideo}>
          {video.status === 'uploading' && <TimeIcon />}
          {video.thumb_url && <img src={video.thumb_url} alt="" />}
        </div>
        <div className={styles.infoContainer} onClick={selectVideo}>
          <div className={styles.title}>{video.title}</div>
          <div className={styles.time}>{video.duration_secs}s</div>
        </div>
        <div className={styles.actionContainer}>
          <div className={styles.editButton} onClick={openModal}>
            <Edit2Icon />
          </div>
        </div>
      </div>
      <Modal
        modalName={modalName}
        title={`Edit video: ${video.title}`}
      >
        <>
          <SetNameVideo
            titleVideo={video.title}
            imageVideo={video.thumb_url}
            onSubmit={handleSubmit}
            deleteVideo={() => dispatch(deleteVideo(video.title, modalName))}
          />
        </>
      </Modal>
    </>
  )
}
