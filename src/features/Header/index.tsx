import React, { FC } from 'react'
import logoHeader from 'common/images/logoHeader.jpg'
import { NavBar } from 'features/NavBar'
import { NavLink } from 'react-router-dom'
import { VSIcon } from 'common/icons'
import styles from './styles.module.sass'

export const Header: FC = () => (
  <div className={styles.wrapper}>
    <div className={styles.container}>
      <NavLink to="/surf">
        <VSIcon />
      </NavLink>
      <NavBar />
    </div>
  </div>
)
