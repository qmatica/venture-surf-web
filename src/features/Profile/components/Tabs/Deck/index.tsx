import React, { FC, useState } from 'react'
import { DownloadIcon, Edit2Icon, EyeIcon } from 'common/icons'
import cn from 'classnames'
import { useDispatch } from 'react-redux'
import { ProfileType } from 'features/Profile/types'
import { Button } from 'common/components/Button'
import { uploadDoc, deleteDoc, renameDoc } from 'features/Profile/actions'
import { FileInput } from 'common/components/FileInput'
import { downloadFile } from 'common/utils'
import { Modal } from 'features/Modal'
import { EditFile } from 'features/Profile/components/Tabs/EditFile'
import { FieldValues } from 'react-hook-form'
import styles from './styles.module.sass'

interface IDeck {
  profile: ProfileType
  isEdit: boolean
}

export const Deck: FC<IDeck> = ({ profile, isEdit }) => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const toggleModal = () => setIsOpenModal(!isOpenModal)
  const [title, setTitle] = useState('')
  const [loadingButton, setLoadingButton] = useState<'onSaveButton' | 'onDeleteButton' | null>(null)
  const { docs } = profile[profile.activeRole]
  const sortedDocs = docs._order_.map((key) => ({
    title: key,
    url: docs[key]
  }))

  const isEmpty = sortedDocs.length === 0

  const style = isEmpty ? { alignItems: 'center' } : {}

  const onFileChange = (file: File) => {
    setIsLoading(true)
    dispatch(uploadDoc(file.name, file, () => setIsLoading(false)))
  }

  const onDeleteDeck = () => {
    if (title) {
      setLoadingButton('onDeleteButton')
      dispatch(deleteDoc(title, setIsOpenModal, setLoadingButton))
    }
  }

  const onRenameDoc = (values: FieldValues) => {
    if (title) {
      setLoadingButton('onSaveButton')
      dispatch(renameDoc(
        title,
        values.fileName,
        setIsOpenModal,
        setLoadingButton
      ))
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.docsContainer} style={style}>
        {sortedDocs.map(({ title, url }) => (
          <div key={title} className={styles.wrapper}>
            <div className={styles.doc}>

              <div className={styles.info}>
                <div className={styles.img} />
                <div>
                  <div className={styles.title}>{title}</div>
                  <div className={styles.format}>PDF</div>
                </div>
              </div>

              <div className={styles.actions}>
                <div>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <EyeIcon />
                  </a>
                </div>
                <div onClick={() => downloadFile(url, title)} className={styles.download}><DownloadIcon /></div>
                {isEdit && (
                <div onClick={() => {
                  toggleModal()
                  setTitle(title)
                }}
                ><Edit2Icon />
                </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <Modal
          title={`Edit deck: ${title}`}
          isOpen={isOpenModal}
          onClose={toggleModal}
        >
          <EditFile
            fileName={title}
            loadingButton={loadingButton}
            onSaveFile={onRenameDoc}
            onDeleteFile={onDeleteDeck}
            fileType="docs"
          />
        </Modal>
        {isEmpty && isEdit && (
          <div className={styles.emptyTitle}>Add first document</div>
        )}
      </div>
      {isEdit && (
        <FileInput
          buttonComponent={({ onClick }) => (
            <div className={styles.buttonsContainer} style={style}>
              <Button
                isLoading={isLoading}
                title="Add deck"
                icon="plus"
                onClick={onClick}
                className={cn(isLoading && styles.disabledButton)}
              />
            </div>
          )}
          onChangeFile={onFileChange}
          accept="application/pdf"
          isDisabled={isLoading}
        />
      )}
    </div>
  )
}
