import React, {
  FC, ReactElement, useEffect, useState
} from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  CalendarIcon,
  ExploreIcon,
  MailIcon,
  UserCircleIcon,
  UsersIcon,
  AuthIcon,
  Unlock,
  ShareIcon,
  PencilIcon,
  SettingsIcon,
  BellIcon
} from 'common/icons'
import { useDispatch, useSelector } from 'react-redux'
import { getAuth, getMyUid } from 'features/Auth/selectors'
import { getIsAdminMode } from 'features/Admin/selectors'
import { CounterNotifications } from 'common/components/CounterNotifications'
import { EditJob } from 'features/Profile/components/Job'
import { SettingsEdit } from 'features/Profile/components/Settings'
import { PageType } from './types'
import { DropDownButton } from './components/DropDownButton'
import { getLiked, getLoadersProfile, getMyActiveRole } from '../Profile/selectors'
import { shareLinkMyProfile } from '../Profile/actions'
import styles from './styles.module.sass'
import { NotificationsList } from '../Notifications'
import { useOutside } from '../../common/hooks'
import { getMyNotificationsHistory } from '../Notifications/selectors'

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
    title: 'Notifications',
    icon: <BellIcon />
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
  const liked = useSelector(getLiked)
  const isAdminMode = useSelector(getIsAdminMode)

  const [currentPages, setCurrentPages] = useState<PageType[]>(pages)

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

        if (title === 'Profile') return <ProfileList icon={icon} url={url as string} />

        if (title === 'Notifications') return <NotificationsList key={title} icon={icon} />

        if (title === 'Contacts') {
          countNotifications = liked && Object.values(liked).filter((u) => !u.ignored).length
        }

        return (
          <NavLink
            key={title}
            to={url as string}
            title={title}
            activeClassName={title === 'Admin' ? styles.activeLinkAdmin : styles.activeLink}
          >
            {icon}
            <CounterNotifications count={countNotifications} left={-25} />
          </NavLink>
        )
      })}
    </div>
  )
}

interface IProfileList {
  icon: ReactElement
  url: string
}

const ProfileList: FC<IProfileList> = ({ icon, url }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const myUid = useSelector(getMyUid)
  const loaders = useSelector(getLoadersProfile)
  const notificationsHistory = useSelector(getMyNotificationsHistory)
  const myActiveRole = useSelector(getMyActiveRole)
  const myProfileUrl = `${url}/${myUid}`
  const [isEdit, setIsEdit] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isOpenList, setIsOpenList] = useState(false)

  const toggleOpenList = () => setIsOpenList(!isOpenList)
  const closeList = () => setIsOpenList(false)

  const toggleEdit = () => setIsEdit(!isEdit)
  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen)

  const isActiveNotificationsInOtherRole = Object.values(notificationsHistory)
    .some((notify) => notify.data.role && notify.data.role !== myActiveRole && notify.status === 'active')

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
      onClick: toggleSettings,
      icon: <SettingsIcon />,
      isActiveNotify: isActiveNotificationsInOtherRole
    }
  ]

  return (
    <>
      <DropDownButton
        icon={icon}
        list={dropDownList}
        isActive={location.pathname === myProfileUrl}
        isOpenList={isOpenList}
        onCloseList={closeList}
        onToggleOpenList={toggleOpenList}
        isActiveNotify={isActiveNotificationsInOtherRole}
      />
      <EditJob isOpen={isEdit} onClose={toggleEdit} />
      {isSettingsOpen && <SettingsEdit isOpen onClose={toggleSettings} />}
    </>
  )
}
