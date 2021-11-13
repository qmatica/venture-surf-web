import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  CalendarIcon, ExploreIcon, MailIcon, UserCircleIcon, UsersIcon, AuthIcon, Unlock
} from 'common/icons'
import { useSelector } from 'react-redux'
import styles from './styles.module.sass'
import { getAuth, getMyUid } from '../Auth/selectors'
import { PageType } from './types'
import { getIsAdminMode } from '../Admin/selectors'

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

const pagesAdmin = [
  {
    url: '/admin',
    title: 'Admin',
    icon: <Unlock />
  }
]

export const NavBar = () => {
  const auth = useSelector(getAuth)
  const myUid = useSelector(getMyUid)
  const isAdminMode = useSelector(getIsAdminMode)
  const [currentPages, setCurrentPages] = useState<PageType[]>([])

  useEffect(() => {
    let viewPages = [...pages]
    if (isAdminMode) {
      viewPages = [...pagesAdmin, ...viewPages]
    }
    setCurrentPages(viewPages)
  }, [isAdminMode])

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
      {currentPages.map(({ url, title, icon }) => {
        let formattedUrl = url

        if (title === 'Profile') {
          formattedUrl = `${url}/${myUid}`
        }

        return (
          <NavLink
            key={title}
            to={formattedUrl}
            title={title}
            activeClassName={title === 'Admin' ? styles.activeLinkAdmin : styles.activeLink}
          >
            {icon}
          </NavLink>
        )
      })}
    </div>
  )
}
