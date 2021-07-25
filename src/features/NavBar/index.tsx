import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  CalendarIcon, ExploreIcon, UserCircleIcon, UsersIcon
} from 'common/icons'
import styles from './styles.module.sass'

const pages = [
  {
    url: '/explore',
    title: 'Explore',
    icon: <ExploreIcon />
  },
  {
    url: '/users',
    title: 'Users',
    icon: <UsersIcon />
  },
  {
    url: '/calendar',
    title: 'Calendar',
    icon: <CalendarIcon />
  },
  {
    url: '/profile',
    title: 'Profile',
    icon: <UserCircleIcon />
  }
]

export const NavBar = () => (
  <div className={styles.container}>
    {pages.map(({ url, title, icon }) => (
      <NavLink
        key={title}
        to={url}
        title={title}
        activeClassName={styles.activeLink}
      >
        {icon}
      </NavLink>
    ))}
  </div>
)
