import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getProfile } from 'features/Profile/selector'
import { Tabs } from 'common/components/Tabs'
import { Deck } from './components/Tabs/Deck'
import { Info } from './components/Tabs/Info'
import { Video } from './components/Tabs/Video'
import { Job } from './components/Job'
import styles from './styles.module.sass'

const tabs = [
  { title: 'Info', Component: Info },
  { title: 'Video', Component: Video },
  { title: 'Deck', Component: Deck }
]

export const Profile = () => {
  const profile = useSelector(getProfile)
  const [tab, setTab] = useState(tabs[0])

  if (!profile) return <>Profile not found</>

  const job = {
    company: profile[profile.activeRole].job?.company,
    title: profile[profile.activeRole].job?.title,
    headline: profile[profile.activeRole].job?.headline
  }
  const name = profile.displayName || `${profile.first_name} ${profile.last_name}`

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerContainer}>
        <div className={styles.aboutProfileContainer}>
          <div className={styles.photoContainer}>
            <img src={profile.photoURL} alt={`${profile.first_name} ${profile.last_name}`} />
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.displayName}>{name}</div>
            <Job job={job} />
          </div>
        </div>
      </div>
      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
      <div>
        <tab.Component profile={profile} />
      </div>
    </div>
  )
}
