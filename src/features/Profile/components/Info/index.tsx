import React, { FC, useCallback } from 'react'
import { ProfileType } from 'features/Profile/types'
import { stages, profileInteractionUsers, industries } from 'features/Profile/constants'
import { UserIcon } from 'common/icons'
import { Tags } from 'common/components/Tags'
import { useDispatch } from 'react-redux'
import { updateMyProfile } from 'features/Profile/actions'
import styles from './styles.module.sass'

interface IInfo {
    profile: ProfileType
}

export const Info: FC<IInfo> = ({ profile }) => {
  const dispatch = useDispatch()
  const updateProfile = useCallback((field: string) => (value: any) => {
    dispatch(updateMyProfile({ [field]: value }, field))
  }, [profile])

  const profileInteraction = {
    title: profileInteractionUsers.title[profile.activeRole],
    value: profile[profileInteractionUsers.content[profile.activeRole]]
  }
  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.title}>About me</div>
        <div className={styles.content}>
          Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
        </div>
      </div>
      <Tags
        title="My startup space is"
        tags={profile.stages}
        dictionary={stages[profile.activeRole]}
        onSave={updateProfile('stages')}
        modalName="stages"
        edit
      />
      <Tags
        title="My startup is"
        tags={profile.industries}
        dictionary={industries}
        onSave={updateProfile('industries')}
        modalName="industries"
        edit
      />
      <Tags
        title="Keywords"
        tags={profile.tags}
        onSave={updateProfile('tags')}
        modalName="tags"
        edit
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
