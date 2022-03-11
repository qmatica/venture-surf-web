import React, {
  FC, useEffect, useState, useMemo
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  actions as actionsContacts, getPublicProfile, getUser, accept, ignore, withdrawLike
} from 'features/Contacts/actions'
import { getProfile } from 'features/Profile/selectors'
import { getMyUid } from 'features/Auth/selectors'
import {
  getIsLoadingOtherProfile, getParamsPublicProfile, getOtherProfile, getAllContacts
} from 'features/Contacts/selectors'
import { Tabs } from 'common/components/Tabs'
import { match } from 'react-router-dom'
import { Preloader } from 'common/components/Preloader'
import { CountBadge } from 'features/Profile/components/CountBadge'
import { Actions } from 'features/User/components/Actions'
import { UsersType, UserType } from 'features/User/types'
import { Button } from 'common/components/Button'
import { Deck } from './components/Tabs/Deck'
import { About } from './components/Tabs/About'
import { Videos } from './components/Tabs/Videos'
import { Job } from './components/Job'
import { SwitchRoles } from './components/SwitchRoles'
import { Avatar } from './components/Avatar'
import styles from './styles.module.sass'
import { USER_RELATIONS } from './constants'

interface Identifiable { uid: string }

interface IProfile {
  match: match<Identifiable>
}

const tabs = [
  { title: 'About', Component: About },
  { title: 'Videos', value: 'videos', Component: Videos },
  { title: 'Deck', value: 'docs', Component: Deck }
]

export const Profile: FC<IProfile> = ({ match }) => {
  const dispatch = useDispatch()
  const isLoadingOtherProfile = useSelector(getIsLoadingOtherProfile)
  const myUid = useSelector(getMyUid)
  const profile = useSelector(getProfile)
  const paramsPublicProfile = useSelector(getParamsPublicProfile)
  const otherProfile = useSelector(getOtherProfile)

  const [initialized, setInitialized] = useState(false)
  const [userRelationType, setUserRelationType] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [tab, setTab] = useState(tabs[0])

  const allContacts = useSelector(getAllContacts) as { mutuals: UsersType, sent: UsersType, received: UsersType }

  useEffect(() => {
    if (otherProfile) {
      const isRelatedUser = Object.entries(allContacts).some(([key, contacts]) => {
        if (contacts?.[match.params.uid]) {
          setUserRelationType(key)
          setCurrentUser(contacts[match.params.uid])
          return true
        }
        return false
      })

      if (!isRelatedUser) {
        setUserRelationType(null)
        setCurrentUser(null)
      }
    }
  }, [allContacts, profile, otherProfile, match.params.uid])

  useEffect(() => {
    if (paramsPublicProfile) {
      const { uid, token } = paramsPublicProfile
      dispatch(getPublicProfile(uid, token))
    } else if (match.params.uid !== myUid) {
      dispatch(getUser(match.params.uid))
    } else {
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

  const renderInteractions = useMemo(() => {
    switch (userRelationType) {
      case USER_RELATIONS.MUTUALS: {
        return (
          <Actions user={currentUser as UserType} userName={name} />
        )
      }
      case USER_RELATIONS.SENT: {
        const isUserFromRecommended = !!(currentUser?.recommendedByList)

        return (
          <Button
            title="Cancel request"
            isLoading={currentUser?.loading?.includes('withdrawLike')}
            onClick={() =>
              dispatch(
                withdrawLike(currentUser?.uid as string, isUserFromRecommended, 'withdrawLike')
              )}
            icon="withdrawLike"
          />
        )
      }
      case USER_RELATIONS.RECEIVED: {
        return (
          <div className={styles.buttons}>
            <Button
              title="Accept"
              isLoading={currentUser?.loading?.includes('accept')}
              onClick={() => dispatch(accept(currentUser?.uid as string))}
              icon="like"
            />
            <Button
              title="Ignore"
              isLoading={currentUser?.loading?.includes('ignore')}
              onClick={() => dispatch(ignore(currentUser?.uid as string))}
              icon="withdrawLike"
            />
          </div>
        )
      }
      default: return null
    }
  }, [userRelationType, currentUser])

  if (!profile || !initialized) return <Preloader />

  const job = {
    company: profile[profile.activeRole]?.job?.company,
    title: profile[profile.activeRole]?.job?.title,
    headline: profile[profile.activeRole]?.job?.headline,
    email: profile[profile.activeRole]?.job?.email,
    web: profile[profile.activeRole]?.job?.web,
    logoCompany: profile[profile.activeRole]?.job?.logoCompany
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
          <div>
            <Avatar profile={profile} myUid={myUid} />
            <div className={styles.infoContainer}>
              <SwitchRoles
                activeRole={profile.activeRole}
                createdRoles={createdRoles}
                isEdit={!otherProfile}
                roles={profile.roles}
              />
              <div className={styles.displayName}>{name}</div>
              {(job.title || job.company) && (
                <div className={styles.titleAndCompanyJob}>
                  {job.title} {(job.title && job.company) ? `at ${job.company}` : job.company}
                </div>
              )}
              {job.email && <div className={styles.email}>{job.email}</div>}
            </div>
          </div>
          <Job job={job} isEdit={!otherProfile} />
        </div>
        {/*<SwitchRoles activeRole={profile.activeRole} createdRoles={createdRoles} isEdit={!otherProfile} />*/}
      </div>
      <div className={styles.buttonsContainer}>
        {renderInteractions}
      </div>
      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} badgeComponent={CountBadge} profile={profile} />
      <div>
        <tab.Component profile={profile} isEdit={!otherProfile} />
      </div>
    </div>
  )
}
