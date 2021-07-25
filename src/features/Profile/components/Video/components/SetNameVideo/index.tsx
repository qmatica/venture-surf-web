import React, { FC, useEffect, useState } from 'react'
import { TrashCanIcon, VideoIcon } from 'common/icons'
import { useSelector } from 'react-redux'
import { RootState } from 'common/types'
import styles from './styles.module.sass'

interface ISetNameVideo {
  titleVideo?: string
  onSubmit: (e: React.FormEvent<IFormElement>) => void
  setSelectedVideo?: (value: File | null) => void
  imageVideo?: string
  deleteVideo?: () => void
}

interface IFormElements extends HTMLFormControlsCollection {
  videoName: HTMLInputElement
}

export interface IFormElement extends HTMLFormElement {
  readonly elements: IFormElements
}

export const SetNameVideo: FC<ISetNameVideo> = ({
  titleVideo,
  imageVideo,
  onSubmit,
  setSelectedVideo,
  deleteVideo
}) => {
  const { profile } = useSelector((state: RootState) => state.profile)
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
    if (setSelectedVideo) setSelectedVideo(null)
    setIsErrorNameExist(false)
  }

  return (
    <div
      className={styles.container}
      style={{
        height: 'inherit',
        paddingBottom: '0px'
      }}
    >
      <form onSubmit={onSubmit}>
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
            {isEdit ? 'Update' : 'Upload'}
          </button>
          {deleteVideo && (
          <button
            type="button"
            className={`${styles.button} ${styles.delete}`}
            onClick={deleteVideo}
          >
            Delete
          </button>
          )}
        </div>
      </form>
    </div>
  )
}
