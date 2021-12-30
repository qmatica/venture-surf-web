import React, { FC, ChangeEvent, useRef } from 'react'
import styles from './styles.module.sass'

interface IFileInput {
  buttonComponent: FC<any>
  onChangeFile: (file: File) => void
  accept?: string
  isDisabled?: Boolean
}

export const FileInput: FC<IFileInput> = ({
  buttonComponent: Button,
  onChangeFile,
  accept,
  isDisabled
}) => {
  const inputFile = useRef<HTMLInputElement | null>(null)
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    e.preventDefault()
    if (e.target.files) onChangeFile(e.target.files[0])
  }

  return (
    <>
      <Button onClick={() => inputFile.current?.click()} />
      <input
        type="file"
        name="file"
        ref={inputFile}
        className={styles.fileInput}
        onChange={onInputChange}
        disabled={!!isDisabled}
        accept={accept}
      />
    </>
  )
}
