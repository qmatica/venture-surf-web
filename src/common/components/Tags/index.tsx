import React, { FC, useEffect, useState } from 'react'
import { Tag } from 'common/components/Tag'
import { useDispatch } from 'react-redux'
import { actions as actionsModal } from 'features/Modal/actions'
import { Modal } from 'features/Modal'
import { ChoiceTags } from 'common/components/ChoiceTags'
import { Edit2Icon } from 'common/icons'
import styles from './styles.module.sass'

interface ITags {
    title: string
    tags?: (string | number)[]
    modalName?: string
    onSave?: (value: any) => void
    dictionary?: { [key: string]: string } | string[]
    edit: boolean
}

export const Tags: FC<ITags> = ({
  title,
  tags,
  modalName,
  onSave,
  dictionary,
  edit
}) => {
  if (edit && !modalName && !onSave) {
    if (!modalName) console.error('string: modalName not found!')
    if (!onSave) console.error('function: onSave not found!')
    return null
  }
  const dispatch = useDispatch()
  const openModal = () => {
    if (modalName) dispatch(actionsModal.openModal(modalName))
  }
  const [updatableTags, setUpdatableTags] = useState<(string | number)[]>([])

  useEffect(() => {
    setUpdatableTags(tags || [])
  }, [tags])

  const save = () => {
    if (onSave) onSave(updatableTags)
  }

  const modalButtons = [
    {
      title: 'Save',
      className: styles.save,
      action: save,
      preloader: true
    },
    {
      title: 'Cancel',
      className: styles.cancel
    }
  ]

  return (
    <div className={styles.infoContainer}>
      <div className={styles.title}>
        {title}
      </div>
      <div className={styles.content}>
        {tags?.length ? (
          <div className={styles.flex}>
            {tags.map((tag: string | number) => (
              <Tag key={tag} value={tag} dictionary={dictionary} />
            ))}
            {edit && <Tag value={<Edit2Icon />} action={openModal} className={styles.editTagButton} />}
          </div>
        ) : (
          <Tag value="+ Add" action={openModal} color="#1557FF" />
        )}
      </div>
      {modalName && (
      <Modal
        modalName={modalName}
        title={title}
        modalButtons={modalButtons}
      >
        <ChoiceTags tags={updatableTags} onChange={setUpdatableTags} dictionary={dictionary} />
      </Modal>
      )}
    </div>
  )
}
