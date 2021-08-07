import React, { FC, memo } from 'react'
import { SwitchRoles } from './components/SwitchRoles'
import { Header } from './components/Header'
import { Actions } from './components/Actions'
import { Videos } from './components/Videos'
import { Tags } from './components/Tags'
import { Assets } from './components/Assets'
import { UserType } from './types'
import styles from './styles.module.sass'

interface IUser {
    user: UserType
    rightSide?: 'tags' | 'assets'
    activeButtons?: React.FC<any>
    viewActions?: boolean
    viewVideos?: boolean
}

export const User: FC<IUser> = memo(({
  user,
  rightSide,
  activeButtons,
  viewActions = false,
  viewVideos = false
}) => {
  const name = user.name || user.displayName || `${user.first_name} ${user.last_name}`

  let rightSideContent
  switch (rightSide) {
    case 'tags': {
      rightSideContent = (
        <Tags
          tags={user.tags}
          stages={user.stages}
          industries={user.industries}
          activeRole={user.activeRole}
        />
      )
      break
    }
    case 'assets': {
      rightSideContent = <Assets />
      break
    }
    default:
      break
  }

  return (
    <div className={styles.container}>
      <SwitchRoles />
      <Header
        name={name}
        photoURL={user.photoURL}
        job={user.job}
        activeButtons={activeButtons}
        rightSide={rightSideContent}
      />
      {viewActions && <Actions />}
      {viewVideos && <Videos videos={user.content?.videos} userId={user.uid} userName={name} />}
    </div>
  )
})
