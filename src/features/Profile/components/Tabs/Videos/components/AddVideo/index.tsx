import React, { FC, useState } from 'react'
import { PlusIcon, VideoIcon } from 'common/icons'
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'features/Modal'
import { uploadVideo } from 'features/Profile/actions'
import { DropZone } from 'features/Profile/components/Tabs/Videos/components/AddVideo/DropZone'
import { RootState } from 'common/types'
import { EditFile, IFormElement } from 'features/Profile/components/Tabs/EditFile'
import styles from './styles.module.sass'

export const AddVideo: FC = () => {
  const dispatch = useDispatch()
  const { progressLoadingFile } = useSelector((state: RootState) => state.profile)
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [loadingButton, setLoadingButton] = useState<'onSaveButton' | null>(null)

  const toggleModal = () => setIsOpenModal(!isOpenModal)

  const getTitleModal = () => {
    if (selectedVideo) {
      return 'Video name'
    }
    if (progressLoadingFile) {
      return 'Uploading video'
    }
    return 'Add video'
  }

  const onUpload = (e: React.FormEvent<IFormElement>, title: string) => {
    e.preventDefault()
    if (selectedVideo) {
      setLoadingButton('onSaveButton')
      dispatch(uploadVideo(selectedVideo, title, setIsOpenModal, setLoadingButton))
      setSelectedVideo(null)
    }
  }

  return (
    <>
      <div className={styles.addVideoButton} onClick={toggleModal}>
        <PlusIcon />
        <div>Add video</div>
      </div>
      <Modal title={getTitleModal()} isOpen={isOpenModal} onClose={toggleModal}>
        <>
          {selectedVideo ? (
            <EditFile
              onSaveFile={onUpload}
              loadingButton={loadingButton}
              onSetSelectedFile={setSelectedVideo}
              fileType="videos"
              icon={VideoIcon}
            />
          ) : (
            <DropZone setSelectedVideo={setSelectedVideo} progressLoadingFile={progressLoadingFile} accept="video/*" />
          )}
        </>
      </Modal>
    </>
  )
}
