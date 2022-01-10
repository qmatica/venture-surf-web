import React, { FC, useState } from 'react'
import { Edit2Icon, TimeIcon } from 'common/icons'
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
  const [isLoadingButton, setIsLoadingButton] = useState<'onSaveButton' | 'onDeleteButton' | null>(null)

  const toggleModal = () => setIsOpenModal(!isOpenModal)

  const onRenameVideo = (e: React.FormEvent<IFormElement>) => {
    e.preventDefault()
    setIsLoadingButton('onSaveButton')
    dispatch(renameVideo(
      video.assetID,
      video.title,
      e.currentTarget.elements.fileName.value,
      setIsOpenModal,
      setIsLoadingButton
    ))
  }

  const onDeleteVideo = () => {
    setIsLoadingButton('onDeleteButton')
    dispatch(deleteVideo(video.title, setIsOpenModal, setIsLoadingButton))
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
            titleFile={video.title}
            imageFile={video.img}
            isLoadingButton={isLoadingButton}
            onSaveFile={onRenameVideo}
            onDeleteFile={onDeleteVideo}
            fileType="video"
          />
        </>
      </Modal>
    </>
  )
}
