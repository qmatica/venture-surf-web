import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Tabs } from 'common/components/Tabs'
import { FilterIcon } from 'common/icons'
import { RootState } from 'common/types'
import { Mutuals } from './components/Mutuals'
import { Received } from './components/Received'
import { Sent } from './components/Sent'
import { actions } from './actions'
import styles from './styles.module.sass'

const tabs = [
  { title: 'Mutuals', Component: Mutuals },
  { title: 'Sent', Component: Sent },
  { title: 'Received', Component: Received }
]

export const Contacts = () => {
  const dispatch = useDispatch()

  const { search } = useSelector((state: RootState) => state.contacts)

  const [tab, setTab] = useState(tabs[0])

  useEffect(() => () => {
    dispatch(actions.setSearch(''))
  }, [])

  const onSearchChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = e
    dispatch(actions.setSearch(value))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          className={styles.input}
          placeholder="Search"
          value={search}
          onChange={onSearchChanged}
        />
        <div className={styles.filterButton}>
          <FilterIcon />
        </div>
      </div>
      <Tabs tabs={tabs} onChange={setTab} activeTab={tab} />
      <tab.Component />
    </div>
  )
}
