import React, { FC } from 'react'
import logoHeader from 'common/images/logoHeader.jpg'
import { NavBar } from 'features/NavBar'
import { NavLink } from 'react-router-dom'
import styles from './styles.module.sass'

export const Header: FC = () => (
  <div className={styles.wrapper}>
    <div className={styles.container}>
      <NavLink to="/surf">
        <img style={{ marginLeft: '-7px' }} src={logoHeader} alt="Venture Surf" draggable={false} />
      </NavLink>
      <NavBar />
    </div>
  </div>
)
