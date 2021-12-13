import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  CalendarIcon, ExploreIcon, MailIcon, UserCircleIcon, UsersIcon, AuthIcon, Unlock
} from 'common/icons'
import { useSelector } from 'react-redux'
import { getAuth } from 'features/Auth/selectors'
import { getIsAdminMode } from 'features/Admin/selectors'
import { RootState } from 'common/types'
import { ProfileType } from 'features/Profile/types'
import { CounterNotifications } from 'common/components/CounterNotifications'
import { PageType } from './types'
import styles from './styles.module.sass'

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
  const { profile } = useSelector((state: RootState) => state.profile) as { profile: ProfileType }
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
        let countNotifications

        if (title === 'Profile') {
          formattedUrl = `${url}/${profile.uid}`
        }

        if (title === 'Contacts') {
          countNotifications = Object.keys(profile.liked)?.length
        }

        return (
          <NavLink
            key={title}
            to={formattedUrl}
            title={title}
            activeClassName={title === 'Admin' ? styles.activeLinkAdmin : styles.activeLink}
          >
            {icon}
            <CounterNotifications count={countNotifications} />
          </NavLink>
        )
      })}
    </div>
  )
}
