import React, { FC, useEffect, useState } from 'react'
import { Tag } from 'common/components/Tag'
import { Modal } from 'features/Modal'
import { ChoiceTags } from 'common/components/ChoiceTags'
import { Edit2Icon } from 'common/icons'
import { Button } from 'common/components/Button'
import cn from 'classnames'
import styles from './styles.module.sass'

interface ITags {
    title: string
    tags?: (string | number)[]
    onSave?: (value: any) => void
    dictionary?: { [key: string]: string } | string[]
    minSize?: boolean
}

export const Tags: FC<ITags> = ({
  title,
  tags,
  onSave,
  dictionary,
  minSize
}) => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [updatableTags, setUpdatableTags] = useState<(string | number)[]>(tags || [])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpenModal) toggleModal()
    if (isLoading) setIsLoading(false)
  }, [tags])

  useEffect(() => {
    if (!isOpenModal) setUpdatableTags(tags || [])
  }, [isOpenModal])

  const toggleModal = () => setIsOpenModal(!isOpenModal)

  const save = () => {
    if (onSave) {
      setIsLoading(true)
      onSave(updatableTags)
    }
  }

  if (!onSave && !tags?.length) return null

  let className = ''

  if (minSize) {
    className = styles.minSize
  }

  return (
    <div className={styles.infoContainer}>
      <div className={styles.title} style={{ fontSize: minSize ? '15px' : 'default' }}>{title}</div>
      <div className={styles.content}>
        {tags?.length ? (
          <div className={styles.flex}>
            {tags.map((tag: string | number) => (
              <Tag key={tag} value={tag} dictionary={dictionary} className={className} />
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
            <Button
              title="Save"
              isLoading={isLoading}
              className={cn(styles.button, styles.save)}
              onClick={save}
              disabled={tags?.join(',') === updatableTags.join(',')}
            />
            <Button
              title="Close"
              className={cn(styles.button, styles.close)}
              onClick={toggleModal}
            />
          </div>
        </>
      </Modal>
    </div>
  )
}
