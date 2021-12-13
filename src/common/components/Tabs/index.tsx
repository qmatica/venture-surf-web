import React, { FC } from 'react'
import { ProfileType } from 'features/Profile/types'
import { CounterNotifications } from 'common/components/CounterNotifications'
import styles from './styles.module.sass'

export type TabType = { title: string, Component: React.FunctionComponent<any> }

interface ITabs {
    tabs: TabType[]
    onChange: ({ title, Component }: TabType) => void
    activeTab: TabType
    profile?: ProfileType
}

export const Tabs: FC<ITabs> = ({
  tabs, onChange, activeTab, profile
}) => (
  <div className={styles.tabsContainer}>
    {tabs.map(({ title, Component }) => {
      let countContacts
      if (profile && title === 'Received') {
        countContacts = Object.keys(profile.liked)?.length
      }
      return (
        <div
          key={title}
          className={`${styles.tab} ${activeTab.title === title ? styles.active : ''}`}
          onClick={() => onChange({ title, Component })}
        >
          <div>
            {title}
          </div>
          <CounterNotifications count={countContacts} left={5} />
        </div>
      )
    })}
  </div>
)
