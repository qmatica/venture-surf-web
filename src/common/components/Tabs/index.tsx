import React, { FC } from 'react'
import { ProfileType } from 'features/Profile/types'
import styles from './styles.module.sass'

export type TabType = { title: string, Component: FC<any>, value?: string }

interface ITabs {
  tabs: TabType[]
  onChange: ({ title, Component }: TabType) => void
  activeTab: TabType
  profile?: ProfileType
  badgeComponent: FC<any>
}

export const Tabs: FC<ITabs> = ({
  tabs, onChange, activeTab, profile, badgeComponent: BadgeComponent
}) => (
  <div className={styles.tabsContainer}>
    {tabs.map(({ title, value, Component }) => {
      let countContacts
      if (profile && title === 'Received') {
        countContacts = Object.values(profile.liked).filter((u) => !u.ignored).length
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
          <BadgeComponent count={countContacts} left={5} profile={profile} value={value} />
        </div>
      )
    })}
  </div>
)
