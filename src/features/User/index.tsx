import React, { FC, memo } from 'react'
import { SwitchRoles } from './components/SwitchRoles'
import { Body } from './components/Body'
import { Actions } from './components/Actions'
import { Videos } from './components/Videos'
import { Tags } from './components/Tags'
import { Assets } from './components/Assets'
import { UserType } from './types'
import styles from './styles.module.sass'

interface IUser {
    user: UserType
    rightSide?: 'tags' | 'assets'
    viewActions?: boolean
    viewVideos?: boolean
    switchRoles?: boolean
    typeUser: 'mutuals' | 'received' | 'sent' | 'surf'
}

export const User: FC<IUser> = memo(({
  user,
  rightSide,
  viewActions = false,
  viewVideos = false,
  switchRoles = false,
  typeUser
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
      {switchRoles && <SwitchRoles />}
      <Body
        user={user}
        rightSide={rightSideContent}
        typeUser={typeUser}
      />
      {viewActions && <Actions user={user} />}
      {viewVideos && <Videos videos={user.content?.videos} userId={user.uid} userName={name} />}
    </div>
  )
})
