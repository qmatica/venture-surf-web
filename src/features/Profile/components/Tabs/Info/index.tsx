import React, { FC, useCallback } from 'react'
import { ProfileType } from 'features/Profile/types'
import { profileInteractionUsers } from 'features/Profile/constants'
import { UserIcon } from 'common/icons'
import { Tags } from 'common/components/Tags'
import { useDispatch } from 'react-redux'
import { updateMyProfile } from 'features/Profile/actions'
import { industries, stages } from 'common/constants'
import styles from './styles.module.sass'

interface IInfo {
    profile: ProfileType
    isEdit: boolean
}

export const Info: FC<IInfo> = ({ profile, isEdit }) => {
  const dispatch = useDispatch()
  const updateProfile = useCallback((field: string) => (value: any) => {
    dispatch(updateMyProfile({ [field]: value }))
  }, [profile])

  const profileInteraction = {
    title: profileInteractionUsers.title[profile.activeRole],
    value: profile[profileInteractionUsers.content[profile.activeRole]]
  }

  const titleStages = profile.activeRole === 'founder' ? 'My startup space is' : 'My investors industries'
  const titleIndustries = profile.activeRole === 'founder' ? 'My startup is' : 'My investments stages'

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.title}>About me</div>
        <div className={styles.content}>
          Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non
          numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
        </div>
      </div>
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
      {profileInteraction.value && (
      <div className={styles.infoContainer}>
        <div className={styles.title}>
          {profileInteraction.title}
        </div>
        <div className={styles.content}>
          {Object.entries(profileInteraction.value)
            .map(([name, value]) => (
              <div className={styles.userContainer} key={name}>
                <div className={styles.photoContainer}><UserIcon /></div>
                <div className={styles.displayName}>{name}</div>
                <div className={styles.status}>{value.status}</div>
              </div>
            ))}
        </div>
      </div>
      )}
    </div>
  )
}
