import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions as actionsContacts, getUser } from 'features/Contacts/actions'
import { getMyProfile } from 'features/Profile/selectors'
import { getMyUid } from 'features/Auth/selectors'
import { getIsViewPublicProfile, getOtherProfile } from 'features/Contacts/selectors'
import { Tabs } from 'common/components/Tabs'
import { match } from 'react-router-dom'
import { Deck } from './components/Tabs/Deck'
import { Info } from './components/Tabs/Info'
import { Video } from './components/Tabs/Video'
import { Job } from './components/Job'
import { SwitchRoles } from './components/SwitchRoles'
import { ProfileType } from './types'
import { Avatar } from './components/Avatar'
import { ShareLinkProfile } from './components/ShareLinkProfile'
import styles from './styles.module.sass'

interface Identifiable { uid: string }

interface IProfile {
  match: match<Identifiable>
}

const tabs = [
  { title: 'Info', Component: Info },
  { title: 'Video', Component: Video },
  { title: 'Deck', Component: Deck }
]

export const Profile: FC<IProfile> = ({ match }) => {
  const dispatch = useDispatch()
  const myProfile = useSelector(getMyProfile)
  const myUid = useSelector(getMyUid)
  const isViewPublicProfile = useSelector(getIsViewPublicProfile)
  const otherProfile = useSelector(getOtherProfile)

  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [tab, setTab] = useState(tabs[0])

  useEffect(() => {
    if (!isViewPublicProfile) {
      if (match.params.uid !== myUid) {
        dispatch(getUser(match.params.uid))
      } else {
        dispatch(actionsContacts.setOtherProfile(null))
        setProfile(myProfile)
      }
    }
    return () => {
      dispatch(actionsContacts.setOtherProfile(null))
      if (isViewPublicProfile) dispatch(actionsContacts.setIsViewPublicProfile(false))
    }
  }, [match])

  useEffect(() => {
    if (otherProfile) {
      setProfile(otherProfile)
    }
  }, [otherProfile])

  if (!profile) return <>Loading profile</>

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
