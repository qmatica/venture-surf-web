import React, { FC, useState } from 'react'
import { DownloadIcon, Edit2Icon, EyeIcon } from 'common/icons'
import cn from 'classnames'
import { useDispatch } from 'react-redux'
import { ProfileType } from 'features/Profile/types'
import { Button } from 'common/components/Button'
import { uploadDoc, deleteDoc, renameDoc } from 'features/Profile/actions'
import { FileInput } from 'common/components/FileInput'
import { Modal } from 'features/Modal'
import { IFormElement, EditFile } from 'features/Profile/components/Tabs/EditFile'
import styles from './styles.module.sass'

interface IDeck {
  profile: ProfileType
  isEdit: boolean
}

export type DeckType = {
  title: string,
  url: string,
}

export const Deck: FC<IDeck> = ({ profile, isEdit }) => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const toggleModal = () => setIsOpenModal(!isOpenModal)
  const [currentDoc, setCurrentDoc] = useState<DeckType | null>(null)
  const [isLoadingButton, setIsLoadingButton] = useState<'onSaveButton' | 'onDeleteButton' | null>(null)
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
    if (currentDoc) {
      setIsLoadingButton('onDeleteButton')
      dispatch(deleteDoc(currentDoc.title, setIsOpenModal, setIsLoadingButton))
    }
  }

  const onRenameDoc = (e: React.FormEvent<IFormElement>) => {
    e.preventDefault()
    if (currentDoc) {
      setIsLoadingButton('onSaveButton')
      dispatch(renameDoc(
        currentDoc.title,
        e.currentTarget.elements.fileName.value,
        setIsOpenModal,
        setIsLoadingButton
      ))
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.docsContainer} style={style}>
        {sortedDocs.map((currentDoc) => (
          <div key={currentDoc.title} className={styles.wrapper}>
            <div className={styles.doc}>
              <a href={currentDoc.url} target="_blank" rel="noopener noreferrer">
                <div className={styles.info}>
                  <div className={styles.img} />
                  <div>
                    <div className={styles.title}>{currentDoc.title}</div>
                    <div className={styles.format}>PDF</div>
                  </div>
                </div>
              </a>
              <div className={styles.actions}>
                <div><EyeIcon /></div>
                <div className={styles.download}><DownloadIcon /></div>
                {isEdit && <div onClick={() => { toggleModal(); setCurrentDoc(currentDoc) }}><Edit2Icon /></div>}
              </div>
            </div>
          </div>
        ))}
        <Modal
          title={`Edit deck: ${currentDoc?.title}`}
          isOpen={isOpenModal}
          onClose={toggleModal}
        >
          <>
            <EditFile
              titleFile={currentDoc?.title}
              isLoadingButton={isLoadingButton}
              onSaveFile={onRenameDoc}
              onDeleteFile={onDeleteDeck}
              fileType="doc"
            />
          </>
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
