import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  CalendarIcon, ExploreIcon, MailIcon, UserCircleIcon, UsersIcon
} from 'common/icons'
import { useSelector } from 'react-redux'
import styles from './styles.module.sass'
import { getMyUid } from '../Auth/selectors'

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

export const NavBar = () => {
  const myUid = useSelector(getMyUid)
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
