import React, { FC, useEffect, useState } from 'react'
import { PreloaderIcon, TrashCanIcon, VideoIcon } from 'common/icons'
import { useSelector } from 'react-redux'
import { getMyProfile } from 'features/Profile/selectors'
import styles from './styles.module.sass'

interface IEditFile {
  fileName?: string
  previewUrl?: string
  fileType: 'videos' | 'docs'
  loadingButton?: 'onSaveButton' | 'onDeleteButton' | null
  onSaveFile: (e: React.FormEvent<IFormElement>, title: string) => void
  onSetSelectedFile?: (value: File | null) => void
  onDeleteFile?: () => void
  icon?: React.ComponentType
}

interface IFormElements extends HTMLFormControlsCollection {
  fileName: HTMLInputElement
}

export interface IFormElement extends HTMLFormElement {
  readonly elements: IFormElements
}

export const EditFile: FC<IEditFile> = ({
  fileName,
  previewUrl,
  loadingButton,
  onSaveFile,
  onSetSelectedFile,
  onDeleteFile,
  fileType,
  icon: Icon
}) => {
  const profile = useSelector(getMyProfile)
  const [title, setTitle] = useState(fileName || '')
  const [isErrorNameExist, setIsErrorNameExist] = useState(false)

  const isEdit = fileName

  const handleChangeTitle = (title: string) => {
    if (profile) {
      const existingTitle = profile[profile.activeRole][fileType]._order_
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
    if (loadingButton === 'onSaveButton') return <PreloaderIcon />
    if (isEdit) return 'Update'
    return 'Upload'
  }

  return (
    <div className={styles.container}>
      <form onSubmit={(e: React.FormEvent<IFormElement>) => onSaveFile(e, title)}>
        <div className={styles.setTitleFileContainer}>
          <div className={styles.previewImage}>
            {previewUrl ? <img src={previewUrl} alt={previewUrl} /> : Icon && <Icon />}
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
            disabled={title === fileName || isErrorNameExist || !title.length}
          >
            {getTitleOnSaveButton()}
          </button>
          {onDeleteFile && (
          <button
            type="button"
            className={`${styles.button} ${styles.delete}`}
            onClick={onDeleteFile}
          >
            {loadingButton === 'onDeleteButton' ? <PreloaderIcon /> : 'Delete'}
          </button>
          )}
        </div>
      </form>
    </div>
  )
}
