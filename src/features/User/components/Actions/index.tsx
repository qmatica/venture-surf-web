import React, { FC } from 'react'
import { Button } from 'common/components/Button'
import styles from './styles.module.sass'
import { UserType } from '../../types'

interface IActions {
    user: UserType
}

export const Actions: FC<IActions> = ({ user }) => (
  <div className={styles.container}>
    <div>
      {user.activeActions?.map((activeAction) => {
        if (!user.actions) return null
        return (
          <Button
            title={activeAction.title}
            icon={<activeAction.icon />}
            isLoading={user.loaders.includes(activeAction.action)}
            className={styles.buttonCall}
            onClick={user.actions[activeAction.action]}
          />
        )
      })}
    </div>
    {/*<div>
      <Button title="Call now" icon={<PhoneCallIcon />} className={styles.buttonCall} />
      <Button title="Arrange a meeting" icon={<CalendarMinIcon />} />
    </div>
    <div>
      <Button title="Recommend" icon={<PeopleIcon />} />
    </div>*/}
  </div>
)
