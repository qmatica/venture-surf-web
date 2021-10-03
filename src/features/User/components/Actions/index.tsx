import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
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

        if (key === 'openChat') {
          const history = useHistory()

          const openChatAction = { ...action }

          // eslint-disable-next-line no-param-reassign
          action = {
            ...action,
            onClick: () => openChatAction.onClick(() => history.push('conversations'))
          }
        }
        return (
          <Button
            key={key}
            title={action.title}
            isLoading={action.isLoading}
            className={className}
            onClick={action.onClick}
            icon={action.icon && <action.icon />}
          />
        )
      })}
    </div>
  )
}
