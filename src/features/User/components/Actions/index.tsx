import React, { FC } from 'react'
import { Button } from 'common/components/Button'
import styles from './styles.module.sass'
import { UserType } from '../../types'
import { EnumActionsUser } from '../../constants'

interface IActions {
    user: UserType
}

export const Actions: FC<IActions> = ({ user }) => {
  const actions = Object.entries(user.actions).filter(([key, action]) => action.type === EnumActionsUser.static)

  return (
    <div className={styles.container}>
      {actions.map(([key, action]) => {
        let className = ''
        if (key === 'callNow') className = styles.buttonCall
        return (
          <Button
            title={action.title}
            isLoading={action.isLoading}
            className={className}
            onClick={action.onClick}
          />
        )
      })}
    </div>
  )
}
