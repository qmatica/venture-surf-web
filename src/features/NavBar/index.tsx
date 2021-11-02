import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  CalendarIcon, ExploreIcon, MailIcon, UserCircleIcon, UsersIcon, AuthIcon
} from 'common/icons'
import { useSelector } from 'react-redux'
import styles from './styles.module.sass'
import { getAuth, getMyUid } from '../Auth/selectors'

const pages = [
  {
    url: '/surf',
    title: 'Surf',
    icon: <ExploreIcon />
  },
  {
    url: '/contacts',
    title: 'Contacts',
    icon: <UsersIcon />
  },
  {
    url: '/calendar',
    title: 'Calendar',
    icon: <CalendarIcon />
  },
  {
    url: '/conversations',
    title: 'Conversations',
    icon: <MailIcon />
  },
  {
    url: '/profile',
    title: 'Profile',
    icon: <UserCircleIcon />
  }
]

const pagesForUnauthorized = [
  {
    url: '/auth',
    title: 'Auth',
    icon: <AuthIcon />
  }
]

export const NavBar = () => {
  const auth = useSelector(getAuth)
  const myUid = useSelector(getMyUid)

  if (!auth) {
    return (
      <div className={`${styles.container} ${styles.unauthorized}`}>
        {pagesForUnauthorized.map(({ url, title, icon }) => (
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
  }
  return (
    <div className={styles.container}>
      {pages.map(({ url, title, icon }) => {
        let formattedUrl = url

        if (title === 'Profile') {
          formattedUrl = `${url}/${myUid}`
        }

        return (
          <NavLink
            key={title}
            to={formattedUrl}
            title={title}
            activeClassName={styles.activeLink}
          >
            {icon}
          </NavLink>
        )
      })}
    </div>
  )
}
