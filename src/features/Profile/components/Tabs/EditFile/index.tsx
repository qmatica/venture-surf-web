import React, { FC, useEffect, useState } from 'react'
import { PreloaderIcon, TrashCanIcon, VideoIcon } from 'common/icons'
import { useSelector } from 'react-redux'
import { getMyProfile } from 'features/Profile/selectors'
import styles from './styles.module.sass'

interface IEditFile {
  titleFile?: string
  imageFile?: string
  fileType: string
  isLoadingButton?: 'onSaveButton' | 'onDeleteButton' | null
  onSaveFile: (e: React.FormEvent<IFormElement>) => void
  onSetSelectedFile?: (value: File | null) => void
  onDeleteFile?: () => void
}

interface IFormElements extends HTMLFormControlsCollection {
  fileName: HTMLInputElement
}

export interface IFormElement extends HTMLFormElement {
  readonly elements: IFormElements
}

export const EditFile: FC<IEditFile> = ({
  titleFile,
  imageFile,
  isLoadingButton,
  onSaveFile,
  onSetSelectedFile,
  onDeleteFile,
  fileType
}) => {
  const profile = useSelector(getMyProfile)
  const [title, setTitle] = useState('')
  const [isErrorNameExist, setIsErrorNameExist] = useState(false)

  useEffect(() => {
    if (titleFile) setTitle(titleFile)
  }, [])

  const isEdit = titleFile

  const handleChangeTitle = (title: string) => {
    if (profile) {
      const existingTitle: any[] = []
      if (fileType === 'video') {
        existingTitle.push(...profile[profile.activeRole].videos._order_)
      }
      if (fileType === 'doc') {
        existingTitle.push(...profile[profile.activeRole].docs._order_)
      }
      if (existingTitle.includes(title)) {
        setIsErrorNameExist(true)
      }
      if (isErrorNameExist && !existingTitle.includes(title)) {
        setIsErrorNameExist(false)
      }
      setTitle(title)
    }
  }

  const clearAddedFile = () => {
    if (onSetSelectedFile) onSetSelectedFile(null)
    setIsErrorNameExist(false)
  }

  const getTitleOnSaveButton = () => {
    if (isLoadingButton === 'onSaveButton') return <PreloaderIcon />
    if (isEdit) return 'Update'
    return 'Upload'
  }

  return (
    <div className={styles.container}>
      <form onSubmit={onSaveFile}>
        <div className={styles.setTitleFileContainer}>
          <div className={styles.previewImage}>
            {imageFile ? <img src={imageFile} alt={imageFile} /> : <VideoIcon />} {/* TODO: Add PDF icon */}
          </div>
          <div className={styles.inputContainer}>
            <input
              name="fileName"
              className={styles.input}
              type="text"
              value={title}
              onChange={({ target: { value } }) => handleChangeTitle(value)}
              placeholder="Type file name"
              style={{
                borderColor: isErrorNameExist ? '#db4947' : '#D7DFED'
              }}
            />
            {isErrorNameExist && <div className={styles.isErrorNameExist}>Such name exists</div>}
          </div>
          {!isEdit && (
            <div className={styles.clearSelectedFileButton} onClick={clearAddedFile}>
              <TrashCanIcon />
            </div>
          )}
        </div>
        <div className={styles.buttonsContainer}>
          <button
            className={`${styles.button} ${styles.submit}`}
            type="submit"
            disabled={title === titleFile || isErrorNameExist || !title.length}
          >
            {getTitleOnSaveButton()}
          </button>
          {onDeleteFile && (
          <button
            type="button"
            className={`${styles.button} ${styles.delete}`}
            onClick={onDeleteFile}
          >
            {isLoadingButton === 'onDeleteButton' ? <PreloaderIcon /> : 'Delete'}
          </button>
          )}
        </div>
      </form>
    </div>
  )
}
