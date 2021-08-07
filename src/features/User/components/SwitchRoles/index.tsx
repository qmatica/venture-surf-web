import React from 'react'
import styles from './styles.module.sass'

export const SwitchRoles = () => (
  <div className={styles.container}>
    <div className={`${styles.button} ${styles.active}`}>investor</div>
    <div className={styles.button}>founder</div>
  </div>
)
