import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  CalendarIcon, ExploreIcon, MailIcon, UserCircleIcon, UsersIcon, AuthIcon, Unlock, ShareIcon, PencilIcon, SettingsIcon
} from 'common/icons'
import { useDispatch, useSelector } from 'react-redux'
import { getAuth, getMyUid } from 'features/Auth/selectors'
import { getIsAdminMode } from 'features/Admin/selectors'
import { CounterNotifications } from 'common/components/CounterNotifications'
import { EditJob } from 'features/Profile/components/Job'
import { PageType } from './types'
import { DropDownButton } from './components/DropDownButton'
import { getLiked, getLoadersProfile } from '../Profile/selectors'
import { shareLinkMyProfile } from '../Profile/actions'
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
  const location = useLocation()
  const dispatch = useDispatch()

  const auth = useSelector(getAuth)
  const myUid = useSelector(getMyUid)
  const liked = useSelector(getLiked)
  const isAdminMode = useSelector(getIsAdminMode)
  const loaders = useSelector(getLoadersProfile)

  const [currentPages, setCurrentPages] = useState<PageType[]>(pages)
  const [isEdit, setIsEdit] = useState(false)

  const toggleEdit = () => setIsEdit(!isEdit)

  useEffect(() => {
    if (isAdminMode) {
      setCurrentPages((prevPages) => ([...pagesAdmin, ...prevPages]))
    }
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
        let countNotifications

        if (title === 'Profile') {
          const myProfileUrl = `${url}/${myUid}`
          const dropDownList = [
            {
              title: 'Profile',
              url: myProfileUrl,
              icon: <UserCircleIcon size={26} />
            },
            {
              title: 'Share',
              onClick: () => dispatch(shareLinkMyProfile()),
              icon: <ShareIcon />,
              isLoading: loaders.includes('shareMyProfile')
            },
            {
              title: 'Edit',
              onClick: toggleEdit,
              icon: <PencilIcon />
            },
            {
              title: 'Settings',
              onClick: () => console.log('settings'),
              icon: <SettingsIcon />
            }
          ]

          return (
            <DropDownButton
              key={url}
              icon={icon}
              list={dropDownList}
              isActive={location.pathname === myProfileUrl}
            />
          )
        }

        if (title === 'Contacts') {
          countNotifications = liked && Object.keys(liked)?.length
        }

        return (
          <NavLink
            key={title}
            to={url}
            title={title}
            activeClassName={title === 'Admin' ? styles.activeLinkAdmin : styles.activeLink}
          >
            {icon}
            <CounterNotifications count={countNotifications} left={-25} />
          </NavLink>
        )
      })}
      <EditJob isOpen={isEdit} onClose={toggleEdit} />
    </div>
  )
}
