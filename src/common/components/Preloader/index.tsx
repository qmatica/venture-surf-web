import React from 'react'
import logoPreloader from 'common/images/logoPreloader.jpg'
import styles from './styles.module.sass'

export const Preloader = () => (
  <div className={styles.wrapper}>
    <img src={logoPreloader} alt="Venture Surf" />
  </div>
)
