import React, { FC } from 'react'
import styles from './styles.module.sass'

export type TabType = { title: string, Component: React.FunctionComponent<any> }

interface ITabs {
    tabs: TabType[]
    onChange: ({ title, Component }: TabType) => void
    activeTab: TabType
}

export const Tabs: FC<ITabs> = ({ tabs, onChange, activeTab }) => (
  <div className={styles.tabsContainer}>
    {tabs.map(({ title, Component }) => (
      <div
        key={title}
        className={`${styles.tab} ${activeTab.title === title ? styles.active : ''}`}
        onClick={() => onChange({ title, Component })}
      >
        {title}
      </div>
    ))}
  </div>
)
