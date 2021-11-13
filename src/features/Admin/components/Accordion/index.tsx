import React, { FC, useState } from 'react'
import styles from './styles.module.sass'

interface IAccordion {
  title: string
  values: { title: string, value: string }[]
}

export const Accordion: FC<IAccordion> = ({ title, values }) => {
  const [isOpen, setIsOpen] = useState(false)

  const onToggle = () => setIsOpen(!isOpen)

  return (
    <div className={styles.container}>
      <div className={styles.title} onClick={onToggle}>
        {isOpen ? <p>-</p> : <p>+</p>}
        {title}
      </div>
      <div className={`${styles.content} ${isOpen ? styles.opened : styles.hidden}`}>
        {values.map(({ title, value }) => (
          <>
            {value && (
              <div>
                <h4>{title}</h4>
                <div className={styles.value}>{value}</div>
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  )
}
