import React, { FC, useState } from 'react'
import { Edit2Icon, TimeIcon, VideoIcon } from 'common/icons'
import { FormattedVideoType } from 'features/Profile/components/Tabs/Videos'
import { Modal } from 'features/Modal'
import { useDispatch } from 'react-redux'
import { IFormElement, EditFile } from 'features/Profile/components/Tabs/EditFile'
import { deleteVideo, renameVideo } from 'features/Profile/actions'
import styles from './styles.module.sass'

interface IVideoItem {
    video: FormattedVideoType
    activeVideoInPlayer: FormattedVideoType | null
    onSetCurrentVideo: (video: FormattedVideoType) => void
    isEdit: boolean
}

export const VideoItem: FC<IVideoItem> = ({
  video,
  activeVideoInPlayer,
  onSetCurrentVideo,
  isEdit
}) => {
  const dispatch = useDispatch()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [loadingButton, setLoadingButton] = useState<'onSaveButton' | 'onDeleteButton' | null>(null)

  const toggleModal = () => setIsOpenModal(!isOpenModal)

  const onRenameVideo = (e: React.FormEvent<IFormElement>, title: string) => {
    e.preventDefault()
    setLoadingButton('onSaveButton')
    dispatch(renameVideo(
      video.assetID,
      video.title,
      title,
      setIsOpenModal,
      setLoadingButton
    ))
  }

  const onDeleteVideo = () => {
    setLoadingButton('onDeleteButton')
    dispatch(deleteVideo(video.title, setIsOpenModal, setLoadingButton))
  }

  const onSelectVideo = () => onSetCurrentVideo(video)

  return (
    <>
      <div
        className={`${styles.videoContainer} ${activeVideoInPlayer?.assetID === video.assetID ? styles.active : ''}`}
        title={video.title}
      >
        <div className={styles.imgContainer} onClick={onSelectVideo}>
          {!video.assetID && <TimeIcon />}
          {video.img && <img src={video.img} alt="" />}
        </div>
        <div className={styles.infoContainer} onClick={onSelectVideo}>
          <div className={styles.title}>{video.title}</div>
        </div>
        <div className={styles.actionContainer}>
          {video.assetID && isEdit && (
            <div className={styles.editButton} onClick={toggleModal}>
              <Edit2Icon />
            </div>
          )}
        </div>
      </div>
      <Modal
        title={`Edit video: ${video.title}`}
        isOpen={isOpenModal}
        onClose={toggleModal}
      >
        <>
          <EditFile
            fileName={video.title}
            previewUrl={video.img}
            loadingButton={loadingButton}
            onSaveFile={onRenameVideo}
            onDeleteFile={onDeleteVideo}
            fileType="videos"
            icon={VideoIcon}
          />
        </>
      </Modal>
    </>
  )
}
