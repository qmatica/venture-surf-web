import React, { FC } from 'react'
import { CalendarMinIcon, PeopleIcon, PhoneCallIcon } from 'common/icons'
import { Button } from 'common/components/Button'
import styles from './styles.module.sass'

export const Actions: FC = () => (
  <div className={styles.container}>
    <div>
      <Button title="Call now" width="141" icon={<PhoneCallIcon />} className={styles.buttonCall} />
      <Button title="Arrange a meeting" width="215" icon={<CalendarMinIcon />} />
    </div>
    <div>
      <Button title="Recommend" width="172" icon={<PeopleIcon />} />
    </div>
  </div>
)
