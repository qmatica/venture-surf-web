import React, { FC, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ProfileType } from 'features/Profile/types'
import { profileInteractionUsers } from 'features/Profile/constants'
import { UserIcon } from 'common/icons'
import { Tags } from 'common/components/Tags'
import { useDispatch } from 'react-redux'
import { updateMyProfile } from 'features/Profile/actions'
import { industries, stages } from 'common/constants'
import { getImageSrcFromBase64 } from 'common/utils'
import styles from './styles.module.sass'

interface IAbout {
    profile: ProfileType
    isEdit: boolean
}

export const About: FC<IAbout> = ({ profile, isEdit }) => {
  const dispatch = useDispatch()
  const updateProfile = useCallback((field: string) => (value: any) => {
    dispatch(updateMyProfile({ [field]: value }))
  }, [profile])

  const titleStages = profile.activeRole === 'founder' ? 'My startup space is' : 'My investors industries'
  const titleIndustries = profile.activeRole === 'founder' ? 'My startup is' : 'My investments stages'

  return (
    <div className={styles.container}>
      {profile.about && (
        <div className={styles.aboutContainer}>
          <div className={styles.title}>About me</div>
          <div className={styles.content}>{profile.about}</div>
        </div>
      )}
      <Tags
        title={titleStages}
        tags={profile[profile.activeRole]?.stages}
        dictionary={stages[profile.activeRole]}
        onSave={isEdit ? updateProfile('stages') : undefined}
      />
      <Tags
        title={titleIndustries}
        tags={profile[profile.activeRole]?.industries}
        dictionary={industries}
        onSave={isEdit ? updateProfile('industries') : undefined}
      />
      <Tags
        title="Keywords"
        tags={profile.tags}
        onSave={isEdit ? updateProfile('tags') : undefined}
      />
      <Interaction profile={profile} />
    </div>
  )
}

interface IInteraction {
  profile: ProfileType
}

const Interaction: FC<IInteraction> = ({ profile }) => {
  const profileInteraction = useMemo(() => ({
    title: profileInteractionUsers.title[profile.activeRole],
    value: profile[profileInteractionUsers.content[profile.activeRole]]
  }), [profile[profileInteractionUsers.content[profile.activeRole]]])

  if (!profileInteraction.value) return null

  return (
    <div className={styles.aboutContainer}>
      <div className={styles.title}>
        {profileInteraction.title}
      </div>
      <div className={styles.content}>
        {Object.entries(profileInteraction.value)
          .map(([uid, value]) => {
            const user = profile.mutuals[uid]

            if (!user) return null

            const name = user.name || user.displayName || `${user.first_name} ${user.last_name}`
            const { photoURL, photoBase64 } = user

            return (
              <div className={styles.userContainer} key={uid}>
                <Link to={`/profile/${uid}`}>
                  <div className={styles.photoContainer}>
                    {photoURL || photoBase64
                      ? <img src={getImageSrcFromBase64(photoBase64, photoURL)} alt={name} />
                      : <UserIcon />}
                  </div>
                </Link>
                <Link to={`/profile/${uid}`}>
                  <div className={styles.displayName}>{name}</div>
                </Link>
                <div className={styles.status}>{value.status}</div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
