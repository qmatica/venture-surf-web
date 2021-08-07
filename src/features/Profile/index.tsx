import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getProfile } from 'features/Profile/selector'
import { Tabs } from 'common/components/Tabs'
import { Edit2Icon } from 'common/icons'
import { Deck } from './components/Deck'
import { Info } from './components/Info'
import { Video } from './components/Video'
import styles from './styles.module.sass'
import { JobType } from './types'

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

  const getNotFilledField = (title: string) => (
    <div className={styles.notFilledContainer}>
      <div className={styles.notFilled}>{title}</div>
      <div className={styles.edit}><Edit2Icon size="20" /></div>
    </div>
  )

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerContainer}>
        <div className={styles.aboutProfileContainer}>
          <div className={styles.photoContainer}>
            <img src={profile.photoURL} alt={`${profile.first_name} ${profile.last_name}`} />
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.displayName}>{name}</div>
            {job.company ? <div className={styles.companyJob}>{job.company}</div> : getNotFilledField('Company')}
            {job.title && <div className={styles.titleJob}>{job.title}</div>}
            {job.headline && <div className={styles.headlineJob}>{job.headline}</div>}
            {/*<div className={styles.industries}>{profile.industries.join(', ')}</div>*/}
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

const FieldJob = (title: string | undefined) => (
  <div>field</div>
)
