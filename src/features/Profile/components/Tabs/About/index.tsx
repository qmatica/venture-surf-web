import React, {
  FC, useCallback, useMemo, useState, useEffect
} from 'react'
import { ProfileType } from 'features/Profile/types'
import { profileInteractionUsers } from 'features/Profile/constants'
import { Tags } from 'common/components/Tags'
import { useDispatch, useSelector } from 'react-redux'
import { getLoadersProfile, getMyProfile } from 'features/Profile/selectors'
import { updateMyProfile } from 'features/Profile/actions'
import { industries, stages } from 'common/constants'
import { BriefcaseIcon, PreloaderIcon } from 'common/icons'
import { Modal } from 'features/Modal'
import { addInvest, addYourself } from 'features/Surf/actions'
import cn from 'classnames'
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
      <Interaction
        profile={profile}
        isEdit={isEdit}
      />
    </div>
  )
}

interface IInteraction {
  profile: ProfileType
  isEdit: boolean
}

const Interaction: FC<IInteraction> = ({ profile, isEdit }) => {
  const dispatch = useDispatch()
  const loaders = useSelector(getLoadersProfile)
  const myProfile = useSelector(getMyProfile)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [selectedRows, setSelectedRows] = useState<{[key: string]: any}>([])
  const toggleModal = () => {
    setIsOpenModal(!isOpenModal)
    setSelectedRows([])
  }

  useEffect(() => {
    setIsOpenModal(false)
  }, [profile.uid])

  const handleSelectRow = (uid: string) => {
    if (selectedRows[uid]) {
      setSelectedRows({ ...selectedRows, [uid]: null })
    } else {
      setSelectedRows({ ...selectedRows, [uid]: uid })
    }
  }
  const isSelectedInvest = Object.values(selectedRows).some(Boolean)

  const isLoading = loaders.includes('requestToInvest')

  const onAddInvest = (selectedRows: { [key: string]: any }) => {
    const investList = Object.values(selectedRows).filter(Boolean)
    dispatch(
      addInvest(
        investList.shift(),
        investList,
        profileInteractionUsers.content[profile.activeRole],
        setIsOpenModal
      )
    )
  }

  const profileInteraction = useMemo(() => ({
    title: profileInteractionUsers.title[profile.activeRole],
    value: profile[profileInteractionUsers.content[profile.activeRole]] || {},
    labelButton: profileInteractionUsers.labelButton[profile.activeRole],
    requestButton: profileInteractionUsers.requestButton[profile.activeRole],
    addButton: profileInteractionUsers.addButton[profile.activeRole],
    description: profileInteractionUsers.description[profile.activeRole],
    header: profileInteractionUsers.header[profile.activeRole],
    modalTitle: profileInteractionUsers.modalTitle[profile.activeRole]
  }), [profile[profileInteractionUsers.content[profile.activeRole]]])

  const hasUserToInteract = !!Object.entries(profile.mutuals).find(
    ([uid, user]) =>
      !profileInteraction.value?.[uid] && user.activeRole !== profile.activeRole
  )

  const hasInteraction = Object.keys(profileInteraction.value).some((uid) => uid === myProfile?.uid)

  const renderInteractions = useMemo(() => {
    if (!Object.keys(profileInteraction.value).length) {
      if (isEdit) {
        return (
          <div className={styles.backedBy}>
            <BriefcaseIcon />
            <div className={styles.backedByTitle}>{profileInteraction.header}</div>
            <div className={styles.backedByDescription}>
              {profileInteraction.description}
            </div>
            {hasUserToInteract && (
              <div
                className={styles.addButton}
                onClick={toggleModal}
              >
                {profileInteraction.addButton}
              </div>
            )}
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
            .map(([uid, value]) => (
              <UserRow
                key={uid}
                profile={profile}
                uid={uid}
                status={value.status}
                isBacked
                isEdit={isEdit}
              />
            ))}
          {isEdit && (
            <div className={styles.labelButton} onClick={toggleModal}>
              {hasUserToInteract && profileInteraction.labelButton}
            </div>
          )}
        </div>
      </div>
    )
  }, [profileInteraction, isEdit, profile.activeRole])

  return (
    <>
      {renderInteractions}
      {myProfile?.mutuals[profile.uid as string] &&
            !hasInteraction && myProfile?.activeRole !== profile.activeRole && (
              <div
                className={styles.link}
                onClick={() =>
                  dispatch(
                    addYourself(
                      profile.uid as string,
                      profileInteractionUsers.content[profile.activeRole],
                      profile
                    )
                  )}
              >
                Add yourself
              </div>
      )}
      {isEdit && hasUserToInteract && (
      <Modal title={profileInteraction.modalTitle} isOpen={isOpenModal} onClose={toggleModal}>
        <>
          <div className={styles.modalContent}>
            {Object.entries(profile.mutuals).map(
              ([uid, user]) => user.activeRole !== profile.activeRole && !profileInteraction.value?.[uid] && (
                <div onClick={() => handleSelectRow(uid)}>
                  <UserRow
                    key={uid}
                    profile={profile}
                    uid={uid}
                    isSelected={selectedRows[uid]}
                  />
                </div>
              )
            )}
          </div>
          <div className={styles.modalButtonWrapper}>
            <div
              className={cn(
                styles.approveButton, !isSelectedInvest && styles.buttonDisabled
              )}
              onClick={() => onAddInvest(selectedRows)}
            >
              {isLoading ? <PreloaderIcon /> : (<div>{profileInteraction.requestButton}</div>)}
            </div>
          </div>
        </>
      </Modal>
      )}
    </>
  )
}
