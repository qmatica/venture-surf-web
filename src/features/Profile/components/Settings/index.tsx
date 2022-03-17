import React, {
  FC, useEffect, useState, useMemo
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import cn from 'classnames'
import { Button } from 'common/components/Button'
import { Modal } from 'features/Modal'
import { SwitchRoles } from 'features/Profile/components/SwitchRoles'
import { getMyProfile } from 'features/Profile/selectors'
import { DeleteIcon, EyeBlackIcon, LogOutIcon } from 'common/icons'
import { updateMyProfile } from 'features/Profile/actions'
import { signOut, deleteMyUser } from 'features/Auth/actions'
import { actions as actionsContacts } from 'features/Contacts/actions'
import { RoleType } from 'features/Profile/types'
import { LOCAL_STORAGE_VALUES, SETTINGS_MODAL } from 'common/constants'
import { DeleteAllDataModal } from 'features/Profile/components/Settings/DeleteAllDataModal'
import { Toggle } from './Toggle'
import styles from './styles.module.sass'

interface ISettings {
  isOpen: boolean
  onClose: () => void
}

export const SettingsEdit: FC<ISettings> = ({ isOpen, onClose }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteAllDataModalOpen, setIsDeleteAllDataModalOpen] = useState(false)
  const profile = useSelector(getMyProfile)
  const [selectedSettings, setSelectedSettings] = useState({ ...profile?.settings })
  const allSettingsInitial = useMemo(() => ({
    allow_founder_updates: false,
    ...profile?.settings,
    investor: !!profile?.investor?.hidden,
    founder: !!profile?.founder?.hidden,
    isNotificationDisabled: JSON.parse(localStorage.getItem(LOCAL_STORAGE_VALUES.NOTIFY_BEFORE_MEETINGS) || 'false')
  }), [profile?.settings, profile?.investor?.hidden, profile?.founder?.hidden])
  const [rolesToHide, setRolesToHide] = useState({
    investor: allSettingsInitial.investor,
    founder: allSettingsInitial.founder
  })
  const [isNotificationDisabled, setIsNotificationDisabled] = useState<boolean>(
    allSettingsInitial.isNotificationDisabled
  )

  const disabledButton = profile
    ? JSON.stringify(Object.entries({
      ...selectedSettings,
      ...rolesToHide,
      isNotificationDisabled
    }).sort()) === JSON.stringify(Object.entries(allSettingsInitial).sort())
    : false

  useEffect(() => {
    if (!isOpen) {
      setSelectedSettings({ ...profile?.settings })
      setRolesToHide({
        investor: allSettingsInitial.investor,
        founder: allSettingsInitial.founder
      })
      setIsNotificationDisabled(allSettingsInitial.isNotificationDisabled)
    }
  }, [isOpen])

  const save = () => {
    setIsLoading(true)
    localStorage.setItem(LOCAL_STORAGE_VALUES.NOTIFY_BEFORE_MEETINGS, String(isNotificationDisabled))

    const filteredRoles = Object.keys(rolesToHide).filter((role) => rolesToHide[role as RoleType])

    dispatch(
      updateMyProfile(
        {
          settings: selectedSettings,
          hidden: filteredRoles
        },
        () => {
          onClose()
          setIsLoading(false)
        }
      )
    )
  }

  if (!profile) return null

  const createdRoles = {
    founder: !!profile.founder,
    investor: !!profile.investor
  }

  const showMyProfile = () => {
    dispatch(actionsContacts.setOtherProfile(profile))
    onClose()
    if (window.location.pathname.split('/')[1] !== 'profile') {
      history.push(`/profile/${profile.uid}`)
    }
  }

  return (
    <>
      <Modal title="" onClose={onClose} isOpen={isOpen}>
        <div className={styles.settingsContainer}>
          <div className={styles.container}>
            <div className={styles.row1}>
              <div className={styles.title}>Settings</div>
              <div className={styles.business}>
                {(!createdRoles.founder || !createdRoles.investor) ? (
                  <div className={styles.subTitle}>Business page</div>
                ) : (<div className={styles.subTitle}> </div>)}
                <SwitchRoles
                  activeRole={profile.activeRole}
                  createdRoles={createdRoles}
                  isEdit
                  customButton
                  roles={profile.roles}
                />
              </div>
              <div className={styles.line} />
              <Toggle
                id="voice-calls"
                description={SETTINGS_MODAL.ALLOW_UNSCHEDULED_CALLS}
                value={!selectedSettings.disable_instant_calls}
                onClick={() =>
                  setSelectedSettings({
                    ...selectedSettings,
                    disable_instant_calls: !selectedSettings.disable_instant_calls
                  })}
              />
              <div className={styles.line} />
              <div className={cn(styles.subTitle, styles.separator)}>{SETTINGS_MODAL.NOTIFICATIONS}</div>
              <div className={styles.line} />
              <Toggle
                id="requests"
                description={SETTINGS_MODAL.REQUESTS_TO_CONNECT}
                value={selectedSettings.allow_new_matches}
                onClick={() =>
                  setSelectedSettings({
                    ...selectedSettings,
                    allow_new_matches: !selectedSettings.allow_new_matches
                  })}
              />
              <Toggle
                id="updates"
                description={SETTINGS_MODAL.UPDATES_FROM_PEOPLE}
                value={selectedSettings.allow_founder_updates}
                onClick={() =>
                  setSelectedSettings({
                    ...selectedSettings,
                    allow_founder_updates: !selectedSettings.allow_founder_updates
                  })}
              />
              <Toggle
                id="5mins"
                description={SETTINGS_MODAL.NOTIFY_BEFORE_MEETINGS}
                value={isNotificationDisabled}
                onClick={() => setIsNotificationDisabled(!isNotificationDisabled)}
              />
            </div>
            <div className={styles.row2}>
              {/* TODO: Experimental feature API is not ready yet */}
              <Toggle id="experimental" description={SETTINGS_MODAL.EXPERIMENTAL_FEATURES} />
              <div className={styles.line} />
              <div className={styles.accountSettings}>Account Settings</div>
              <div className={styles.line} />
              {profile.founder && (
                <Toggle
                  id="founder-visible"
                  description={SETTINGS_MODAL.VISIBLE_FOUNDER_PROFILE}
                  value={!rolesToHide.founder}
                  onClick={() => setRolesToHide({ ...rolesToHide, founder: !rolesToHide.founder })}
                />
              )}
              {profile.investor && (
                <Toggle
                  id="investor-visible"
                  description={SETTINGS_MODAL.VISIBLE_INVESTOR_PROFILE}
                  value={!rolesToHide.investor}
                  onClick={() => setRolesToHide({ ...rolesToHide, investor: !rolesToHide.investor })}
                />
              )}
              <div className={styles.line} />
              <div
                className={styles.icons}
                onClick={showMyProfile}
              >
                <div className={styles.icon}><EyeBlackIcon /></div>
                <div>{SETTINGS_MODAL.HOW_OTHERS_SEE}</div>
              </div>
              <div className={styles.icons} onClick={() => dispatch(signOut())}>
                <div className={styles.icon}><LogOutIcon /></div>
                <div>{SETTINGS_MODAL.LOG_OUT}</div>
              </div>
              <div
                className={cn(styles.icons, styles.delete)}
                onClick={() => setIsDeleteAllDataModalOpen(true)}
              >
                <div className={styles.icon}><DeleteIcon /></div>
                <div>{SETTINGS_MODAL.DELETE_ALL_DATA}</div>
              </div>
            </div>
          </div>
          <div className={styles.buttons}>
            <Button
              title="Save"
              onClick={save}
              isLoading={isLoading}
              disabled={disabledButton}
            />
            <Button title="Close" onClick={onClose} />
          </div>
        </div>
      </Modal>
      <DeleteAllDataModal
        isOpen={isDeleteAllDataModalOpen}
        onClose={() => setIsDeleteAllDataModalOpen(false)}
        onSubmit={() => {
          setIsDeleteAllDataModalOpen(false)
          return dispatch(deleteMyUser(profile.uid as string))
        }}
      />
    </>
  )
}
