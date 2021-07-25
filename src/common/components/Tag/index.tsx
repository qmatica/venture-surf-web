import React, { FC, ReactElement } from 'react'
import { PlusIcon, TrashCanIcon } from 'common/icons'
import styles from './styles.module.sass'

interface ITag {
    value: string | number | ReactElement
    dictionary?: { [key: string]: string } | string[]
    action?: () => void
    add?: () => void
    remove?: () => void
    color?: string
}

export const Tag: FC<ITag> = ({
  value,
  dictionary,
  action,
  add,
  remove,
  color = '#030D21'
}) => {
  let displayedValue = value
  if (typeof value === 'number' && dictionary && !Array.isArray(dictionary)) {
    displayedValue = dictionary[value]
  }
  return (
    <div className={styles.tag} onClick={action} style={{ cursor: action ? 'pointer' : 'default' }}>
      {add && <div onClick={add} className={`${styles.actionTag} ${styles.leftTag}`}><PlusIcon /></div>}
      <div className={styles.value} style={{ color }}>{displayedValue}</div>
      {remove && <div onClick={remove} className={`${styles.actionTag} ${styles.rightTag}`}><TrashCanIcon /></div>}
    </div>
  )
}
