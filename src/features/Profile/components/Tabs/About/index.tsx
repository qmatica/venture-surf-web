import React, { FC, useCallback, useMemo } from 'react'
import { ProfileType } from 'features/Profile/types'
import { profileInteractionUsers } from 'features/Profile/constants'
import { Tags } from 'common/components/Tags'
import { useDispatch } from 'react-redux'
import { updateMyProfile } from 'features/Profile/actions'
import { industries, stages } from 'common/constants'
import briefcaseIcon from 'common/images/briefcaseIcon.png'
import { UserRow } from './components/UserRow'
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
      <Interaction profile={profile} isEdit={isEdit} />
    </div>
  )
}

interface IInteraction {
  profile: ProfileType
  isEdit: boolean
}

const Interaction: FC<IInteraction> = ({ profile, isEdit }) => {
  const profileInteraction = useMemo(() => ({
    title: profileInteractionUsers.title[profile.activeRole],
    value: profile[profileInteractionUsers.content[profile.activeRole]],
    buttonLabel: profileInteractionUsers.buttonLabel[profile.activeRole]
  }), [profile[profileInteractionUsers.content[profile.activeRole]]])

  if (!profileInteraction.value || !Object.entries(profileInteraction.value).length) {
    if (isEdit && profile.activeRole === 'founder') {
      return (
        <div className={styles.backedBy}>
          <img src={briefcaseIcon} alt="briefcase" draggable="false" />
          <div className={styles.backedByTitle}>You are not yet backed by</div>
          <div className={styles.backedByDescription}>
            Label your investors. We will send them your request. If they
            approve, everyone will see who invested in you. This will add you
            some credits.
          </div>
          <div className={styles.addButton}>Add my investors</div>
        </div>
      )
    }
    return null
  }

  return (
    <div className={styles.aboutContainer}>
      <div className={styles.title}>
        {profileInteraction.title}
      </div>
      <div className={styles.content}>
        {Object.entries(profileInteraction.value)
          .map(([uid, value], index) =>
            <UserRow key={uid} profile={profile} uid={uid} status={value.status} />)}
        <div className={styles.labelButton}>
          {profileInteraction.buttonLabel}
        </div>
      </div>
    </div>
  )
}
