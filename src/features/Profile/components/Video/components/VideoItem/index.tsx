import React, { FC, useState } from 'react'
import { Edit2Icon, TimeIcon } from 'common/icons'
import { VideoType } from 'features/Profile/types'
import { Modal } from 'features/Modal'
import { useDispatch } from 'react-redux'
import { IFormElement, EditVideo } from 'features/Profile/components/Video/components/EditVideo'
import { deleteVideo as deleteVideoThunk, renameVideo as renameVideoThunk } from 'features/Profile/actions'
import styles from './styles.module.sass'

interface IVideoItem {
    video: VideoType
    activeVideoInPlayer: VideoType | null
    onSetCurrentVideo: (video: VideoType) => void
}

export const VideoItem: FC<IVideoItem> = ({
  video,
  activeVideoInPlayer,
  onSetCurrentVideo
}) => {
  const dispatch = useDispatch()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isLoadingButton, setIsLoadingButton] = useState<'onSaveButton' | 'onDeleteButton' | null>(null)

  const toggleModal = () => setIsOpenModal(!isOpenModal)

  const renameVideo = (e: React.FormEvent<IFormElement>) => {
    e.preventDefault()
    setIsLoadingButton('onSaveButton')
    dispatch(renameVideoThunk(
      video.asset_id,
      video.title,
      e.currentTarget.elements.videoName.value,
      setIsOpenModal,
      setIsLoadingButton
    ))
  }

  const deleteVideo = () => {
    setIsLoadingButton('onDeleteButton')
    dispatch(deleteVideoThunk(video.title, setIsOpenModal, setIsLoadingButton))
  }

  const selectVideo = () => onSetCurrentVideo(video)

  return (
    <>
      <div
        className={`${styles.videoContainer} ${activeVideoInPlayer?.asset_id === video.asset_id ? styles.active : ''}`}
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
          <div className={styles.editButton} onClick={toggleModal}>
            <Edit2Icon />
          </div>
        </div>
      </div>
      <Modal
        title={`Edit video: ${video.title}`}
        isOpen={isOpenModal}
        onClose={toggleModal}
      >
        <>
          <EditVideo
            titleVideo={video.title}
            imageVideo={video.thumb_url}
            isLoadingButton={isLoadingButton}
            onSaveVideo={renameVideo}
            onDeleteVideo={deleteVideo}
          />
        </>
      </Modal>
    </>
  )
}
