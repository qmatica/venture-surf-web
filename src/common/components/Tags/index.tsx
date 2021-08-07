import React, { FC, useEffect, useState } from 'react'
import { Tag } from 'common/components/Tag'
import { Modal } from 'features/Modal'
import { ChoiceTags } from 'common/components/ChoiceTags'
import { Edit2Icon, PreloaderIcon } from 'common/icons'
import styles from './styles.module.sass'

interface ITags {
    title: string
    tags?: (string | number)[]
    onSave?: (value: any) => void
    dictionary?: { [key: string]: string } | string[]
}

export const Tags: FC<ITags> = ({
  title,
  tags,
  onSave,
  dictionary
}) => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [updatableTags, setUpdatableTags] = useState<(string | number)[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setUpdatableTags(tags || [])
    if (isOpenModal) toggleModal()
    if (isLoading) setIsLoading(false)
  }, [tags])

  const toggleModal = () => setIsOpenModal(!isOpenModal)

  const save = () => {
    if (onSave) {
      setIsLoading(true)
      onSave(updatableTags)
    }
  }

  if (!onSave && !tags?.length) return null

  return (
    <div className={styles.infoContainer}>
      <div className={styles.title}>{title}</div>
      <div className={styles.content}>
        {tags?.length ? (
          <div className={styles.flex}>
            {tags.map((tag: string | number) => (
              <Tag key={tag} value={tag} dictionary={dictionary} />
            ))}
            {onSave && <Tag value={<Edit2Icon />} action={toggleModal} className={styles.editTagButton} />}
          </div>
        ) : (
          <Tag value="+ Add" action={toggleModal} color="#1557FF" />
        )}
      </div>
      <Modal title={title} isOpen={isOpenModal} onClose={toggleModal}>
        <>
          <ChoiceTags tags={updatableTags} onChange={setUpdatableTags} dictionary={dictionary} />
          <div className={styles.footer}>
            <div className={`${styles.button} ${styles.save}`} onClick={save}>
              {isLoading ? <PreloaderIcon stroke="#96baf6" /> : 'Save'}
            </div>
            <div className={`${styles.button} ${styles.close}`} onClick={toggleModal}>Close</div>
          </div>
        </>
      </Modal>
    </div>
  )
}
