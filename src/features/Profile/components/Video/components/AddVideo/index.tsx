import React, { FC, useState } from 'react'
import { PlusIcon } from 'common/icons'
import { useDispatch, useSelector } from 'react-redux'
import { actions as actionsModal } from 'features/Modal/actions'
import { Modal } from 'features/Modal'
import { uploadVideo } from 'features/Profile/actions'
import { DropZone } from 'features/Profile/components/Video/components/AddVideo/DropZone'
import { RootState } from 'common/types'
import { IFormElement, SetNameVideo } from 'features/Profile/components/Video/components/SetNameVideo'
import styles from './styles.module.sass'

interface IAddVideo {
    modalName: string
}

export const AddVideo: FC<IAddVideo> = ({ modalName }) => {
  const { progressLoadingFile } = useSelector((state: RootState) => state.profile)
  const dispatch = useDispatch()
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)

  const openModal = () => {
    dispatch(actionsModal.openModal(modalName))
  }

  const getTitleModal = () => {
    if (selectedVideo) {
      return 'Video name'
    }
    if (progressLoadingFile) {
      return 'Uploading video'
    }
    return 'Add video'
  }

  const handleSubmit = (e: React.FormEvent<IFormElement>) => {
    e.preventDefault()
    if (selectedVideo) {
      dispatch(uploadVideo(selectedVideo, e.currentTarget.elements.videoName.value, modalName))
      setSelectedVideo(null)
    }
  }

  return (
    <>
      <div className={styles.addVideoButton} onClick={openModal}>
        <PlusIcon />
        <div>Add video</div>
      </div>
      <Modal modalName={modalName} title={getTitleModal()}>
        <>
          {selectedVideo ? (
            <SetNameVideo
              onSubmit={handleSubmit}
              setSelectedVideo={setSelectedVideo}
            />
          ) : (
            <DropZone setSelectedVideo={setSelectedVideo} progressLoadingFile={progressLoadingFile} />
          )}
        </>
      </Modal>
    </>
  )
}
