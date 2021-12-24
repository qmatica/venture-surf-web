import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions as actionsContacts, getPublicProfile, getUser } from 'features/Contacts/actions'
import { getProfile } from 'features/Profile/selectors'
import { getMyUid } from 'features/Auth/selectors'
import { getIsLoadingOtherProfile, getParamsPublicProfile, getOtherProfile } from 'features/Contacts/selectors'
import { Tabs } from 'common/components/Tabs'
import { match } from 'react-router-dom'
import { Preloader } from 'common/components/Preloader'
import { Deck } from './components/Tabs/Deck'
import { About } from './components/Tabs/About'
import { Videos } from './components/Tabs/Videos'
import { Job } from './components/Job'
import { SwitchRoles } from './components/SwitchRoles'
import { Avatar } from './components/Avatar'
import { ShareLinkProfile } from './components/ShareLinkProfile'
import styles from './styles.module.sass'

interface Identifiable { uid: string }

interface IProfile {
  match: match<Identifiable>
}

const tabs = [
  { title: 'About', Component: About },
  { title: 'Videos', Component: Videos },
  { title: 'Deck', Component: Deck }
]

export const Profile: FC<IProfile> = ({ match }) => {
  const dispatch = useDispatch()
  const isLoadingOtherProfile = useSelector(getIsLoadingOtherProfile)
  const myUid = useSelector(getMyUid)
  const profile = useSelector(getProfile)
  const paramsPublicProfile = useSelector(getParamsPublicProfile)
  const otherProfile = useSelector(getOtherProfile)

  const [initialized, setInitialized] = useState(false)
  const [tab, setTab] = useState(tabs[0])

  useEffect(() => {
    if (paramsPublicProfile) {
      const { uid, token } = paramsPublicProfile
      dispatch(getPublicProfile(uid, token))
    } else if (match.params.uid !== myUid) {
      dispatch(getUser(match.params.uid))
    } else {
      if (otherProfile) dispatch(actionsContacts.setOtherProfile(null))
      setInitialized(true)
    }
    return () => {
      dispatch(actionsContacts.setOtherProfile(null))
      if (paramsPublicProfile) dispatch(actionsContacts.setParamsPublicProfile(null))
    }
  }, [match, paramsPublicProfile])

  useEffect(() => {
    if (otherProfile && !isLoadingOtherProfile) {
      setInitialized(true)
    }
  }, [isLoadingOtherProfile])

  if (!profile || !initialized) return <Preloader />

  const job = {
    company: profile[profile.activeRole]?.job?.company,
    title: profile[profile.activeRole]?.job?.title,
    headline: profile[profile.activeRole]?.job?.headline
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
          <Avatar profile={profile} />
          <div className={styles.infoContainer}>
            <div className={styles.displayName}>{name}</div>
            <Job job={job} isEdit={!otherProfile} />
          </div>
        </div>
        <SwitchRoles activeRole={profile.activeRole} createdRoles={createdRoles} isEdit={!otherProfile} />
        <ShareLinkProfile isEdit={!otherProfile} />
      </div>
      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
      <div>
        <tab.Component profile={profile} isEdit={!otherProfile} />
      </div>
    </div>
  )
}
