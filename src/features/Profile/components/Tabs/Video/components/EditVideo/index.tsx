import React, { FC, useEffect, useState } from 'react'
import { PreloaderIcon, TrashCanIcon, VideoIcon } from 'common/icons'
import { useSelector } from 'react-redux'
import { getMyProfile } from 'features/Profile/selectors'
import styles from './styles.module.sass'

interface IEditVideo {
  titleVideo?: string
  imageVideo?: string
  isLoadingButton?: 'onSaveButton' | 'onDeleteButton' | null
  onSaveVideo: (e: React.FormEvent<IFormElement>) => void
  onSetSelectedVideo?: (value: File | null) => void
  onDeleteVideo?: () => void
}

interface IFormElements extends HTMLFormControlsCollection {
  videoName: HTMLInputElement
}

export interface IFormElement extends HTMLFormElement {
  readonly elements: IFormElements
}

export const EditVideo: FC<IEditVideo> = ({
  titleVideo,
  imageVideo,
  isLoadingButton,
  onSaveVideo,
  onSetSelectedVideo,
  onDeleteVideo
}) => {
  const profile = useSelector(getMyProfile)
  const [title, setTitle] = useState('')
  const [isErrorNameExist, setIsErrorNameExist] = useState(false)

  useEffect(() => {
    if (titleVideo) setTitle(titleVideo)
  }, [])

  const isEdit = titleVideo

  const handleChangeTitle = (title: string) => {
    if (profile) {
      const existingTitleVideos = profile[profile.activeRole].videos._order_
      if (existingTitleVideos.includes(title)) {
        setIsErrorNameExist(true)
      }
      if (isErrorNameExist && !existingTitleVideos.includes(title)) {
        setIsErrorNameExist(false)
      }
      setTitle(title)
    }
  }

  const clearAddedVideo = () => {
    if (onSetSelectedVideo) onSetSelectedVideo(null)
    setIsErrorNameExist(false)
  }

  const getTitleOnSaveButton = () => {
    if (isLoadingButton === 'onSaveButton') return <PreloaderIcon />
    if (isEdit) return 'Update'
    return 'Upload'
  }

  return (
    <div className={styles.container}>
      <form onSubmit={onSaveVideo}>
        <div className={styles.setTitleVideoContainer}>
          <div className={styles.videoImage}>
            {imageVideo ? <img src={imageVideo} alt={titleVideo} /> : <VideoIcon />}
          </div>
          <div className={styles.inputContainer}>
            <input
              name="videoName"
              className={styles.input}
              type="text"
              value={title}
              onChange={({ target: { value } }) => handleChangeTitle(value)}
              placeholder="Type name video"
              style={{
                borderColor: isErrorNameExist ? '#db4947' : '#D7DFED'
              }}
            />
            {isErrorNameExist && <div className={styles.isErrorNameExist}>Such name exists</div>}
          </div>
          {!isEdit && (
            <div className={styles.clearSelectedVideoButton} onClick={clearAddedVideo}>
              <TrashCanIcon />
            </div>
          )}
        </div>
        <div className={styles.buttonsContainer}>
          <button
            className={`${styles.button} ${styles.submit}`}
            type="submit"
            disabled={title === titleVideo || isErrorNameExist || !title.length}
          >
            {getTitleOnSaveButton()}
          </button>
          {onDeleteVideo && (
          <button
            type="button"
            className={`${styles.button} ${styles.delete}`}
            onClick={onDeleteVideo}
          >
            {isLoadingButton === 'onDeleteButton' ? <PreloaderIcon /> : 'Delete'}
          </button>
          )}
        </div>
      </form>
    </div>
  )
}
