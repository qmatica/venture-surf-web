import React, { FC } from 'react'
import { Button } from 'common/components/Button'
import styles from './styles.module.sass'
import { UserType } from '../../types'

interface IActions {
    user: UserType
}

export const Actions: FC<IActions> = ({ user }) => (
  <div className={styles.container}>
    {user.activeActions?.map((activeAction) => {
      if (!user.actions) return null
      let className = ''
      if (activeAction.action === 'callNow') className = styles.buttonCall
      return (
        <Button
          title={activeAction.title}
          icon={<activeAction.icon />}
          isLoading={user.loaders.includes(activeAction.action)}
          className={className}
          onClick={user.actions[activeAction.action]}
        />
      )
    })}
  </div>
)
