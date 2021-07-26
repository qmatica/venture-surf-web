import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getProfile } from 'features/Profile/selector'
import { Deck } from './components/Deck'
import { Info } from './components/Info'
import { Video } from './components/Video'
import styles from './styles.module.sass'
import { Tabs } from '../../common/components/Tabs'

const tabs = [
  { title: 'Info', Component: Info },
  { title: 'Video', Component: Video },
  { title: 'Deck', Component: Deck }
]

export const Profile = () => {
  const profile = useSelector(getProfile)
  const [tab, setTab] = useState(tabs[0])

  if (!profile) return <>Profile not found</>

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerContainer}>
        <div className={styles.aboutProfileContainer}>
          <div className={styles.photoContainer}>
            <img src={profile.photoURL} alt={`${profile.first_name} ${profile.last_name}`} />
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.displayName}>{profile.displayName || `${profile.first_name} ${profile.last_name}`}</div>
            <div className={styles.specific}>{profile[profile.activeRole].job?.headline || 'Not filled'}</div>
            <div className={styles.industries}>{profile.industries.join(', ')}</div>
          </div>
        </div>
        <div className={styles.otherContainer}>
          <div className={styles.title}>{profile[profile.activeRole].job?.company || 'Job company'}</div>
          <div className={styles.content}>{profile[profile.activeRole].job?.title || 'Not filled'}</div>
        </div>
      </div>
      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
      <div>
        <tab.Component profile={profile} />
      </div>
    </div>
  )
}
