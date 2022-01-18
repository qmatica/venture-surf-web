import React, { FC, useEffect, useState } from 'react'
import { PreloaderIcon, TrashCanIcon } from 'common/icons'
import { useSelector } from 'react-redux'
import { getMyProfile } from 'features/Profile/selectors'
import { FieldValues, useForm } from 'react-hook-form'
import cn from 'classnames'
import styles from './styles.module.sass'

interface IEditFile {
  fileName?: string
  previewUrl?: string
  fileType: 'videos' | 'docs'
  loadingButton?: 'onSaveButton' | 'onDeleteButton' | null
  onSaveFile: (values: FieldValues) => void
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
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors
  } = useForm()
  const profile = useSelector(getMyProfile)
  const [blockOnSaveButton, setBlockOnSaveButton] = useState(true)
  const [isErrorNameExist, setIsErrorNameExist] = useState(false)

  const isEdit = fileName

  const handleChangeTitle = (title: string) => {
    if (blockOnSaveButton) setBlockOnSaveButton(false)
    if (!title.length) setBlockOnSaveButton(true)
    if (profile) {
      const existingTitle = profile[profile.activeRole][fileType]._order_
      if (existingTitle.includes(title)) {
        setIsErrorNameExist(true)
      }
      if (isErrorNameExist && !existingTitle.includes(title)) {
        setIsErrorNameExist(false)
      }
      setValue('fileName', title)
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
      <form onSubmit={handleSubmit(onSaveFile)}>
        <div className={styles.setTitleFileContainer}>
          <div className={styles.previewImage}>
            {previewUrl ? <img src={previewUrl} alt={previewUrl} /> : Icon && <Icon />}
          </div>
          <div className={styles.inputContainer}>
            <input
              {...register('fileName', {
                required: true,
                maxLength: 30,
                onBlur: () => {
                  if (errors.fileName?.type === 'required') clearErrors()
                },
                onChange: (e) => {
                  handleChangeTitle(e.target.value)
                }
              })}
              className={cn(styles.input, errors.fileName && styles.errorInput)}
              type="text"
              defaultValue={fileName}
              placeholder="Type file name"
              style={{
                borderColor: isErrorNameExist ? '#db4947' : '#D7DFED'
              }}
            />
            {isErrorNameExist && <div className={styles.isErrorNameExist}>Such name exists</div>}
            {errors.fileName?.type === 'maxLength' && (
              <div className={styles.isErrorNameExist}>Max length 30 chars</div>
            )}
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
            disabled={blockOnSaveButton || errors.fileName || isErrorNameExist}
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
