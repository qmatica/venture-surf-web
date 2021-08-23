import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getProfile } from 'features/Profile/selector'
import { Tabs } from 'common/components/Tabs'
import { UserPhotoIcon } from 'common/icons'
import { Deck } from './components/Tabs/Deck'
import { Info } from './components/Tabs/Info'
import { Video } from './components/Tabs/Video'
import { Job } from './components/Job'
import styles from './styles.module.sass'
import { SwitchRoles } from './components/SwitchRoles'

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

  const createdRoles = {
    founder: !!profile.founder,
    investor: !!profile.investor
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerContainer}>
        <div className={styles.aboutProfileContainer}>
          <div className={styles.photoContainer}>
            {profile.photoURL
              ? <img src={profile.photoURL} alt={`${profile.first_name} ${profile.last_name}`} />
              : <UserPhotoIcon />}
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.displayName}>{name}</div>
            <Job job={job} />
          </div>
        </div>
        <SwitchRoles activeRole={profile.activeRole} createdRoles={createdRoles} />
      </div>
      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
      <div>
        <tab.Component profile={profile} />
      </div>
    </div>
  )
}
