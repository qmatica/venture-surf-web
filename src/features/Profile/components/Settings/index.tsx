import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useHistory } from 'react-router-dom'
import cn from 'classnames'
import { Button } from 'common/components/Button'
import { Modal } from 'features/Modal'
import { SwitchRoles } from 'features/Profile/components/SwitchRoles'
import { getMyProfile } from 'features/Profile/selectors'
import { DeleteIcon, EyeBlackIcon, LogOutIcon } from 'common/icons'
import { updateMyProfile } from 'features/Profile/actions'
import { signOut, deleteMyUser } from 'features/Auth/actions'
import { actions as actionsContacts } from 'features/Contacts/actions'
import { Toggle } from './Toggle'
import styles from './styles.module.sass'

interface ISettings {
  isOpen: boolean
  onClose: () => void
}

export const SettingsEdit: FC<ISettings> = ({ isOpen, onClose }) => {
  const history = useHistory()
  const profile = useSelector(getMyProfile)
  const [selectedSettings, setSelectedSettings] = useState({ ...profile?.settings })
  const [rolesToHide, setRolesToHide] = useState({
    investor: !!profile?.investor?.hidden,
    founder: !!profile?.founder?.hidden
  })
  const [disableNotification, setDisableNotification] = useState(false)
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const hiddenRoles = localStorage.getItem('hiddenRoles')
    const isNotificationDisabled = localStorage.getItem('notifications')

    if (hiddenRoles) {
      setRolesToHide(JSON.parse(hiddenRoles))
    }
    if (isNotificationDisabled) {
      setDisableNotification(JSON.parse(isNotificationDisabled))
    }
  }, [])

  useEffect(() => {
    if (!isOpen) setSelectedSettings({ ...profile?.settings })
    setRolesToHide({ investor: !!profile?.investor?.hidden, founder: !!profile?.founder?.hidden })
  }, [isOpen])

  const save = () => {
    setIsLoading(true)

    const filteredRoles = Object.keys(rolesToHide).filter((role) => rolesToHide[role as 'investor' | 'founder'])

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
              description="Allow unscheduled voice calls from my network"
              value={selectedSettings.disable_instant_calls}
              onClick={() => {
                console.log(selectedSettings, '================selectedSettings')
                setSelectedSettings({
                  ...selectedSettings,
                  disable_instant_calls: !selectedSettings.disable_instant_calls
                })
              }}
            />
            <div className={styles.line} />
            <div className={cn(styles.subTitle, styles.separator)}>Notifications</div>
            <div className={styles.line} />
            <Toggle
              id="requests"
              description="Requests to connect"
              value={selectedSettings.allow_new_matches}
              onClick={() =>
                setSelectedSettings({
                  ...selectedSettings,
                  allow_new_matches: !selectedSettings.allow_new_matches
                })}
            />
            <Toggle
              id="updates"
              description="Updates from people follow"
              value={selectedSettings.allow_founder_updates}
              onClick={() =>
                setSelectedSettings({
                  ...selectedSettings,
                  allow_founder_updates: !selectedSettings.allow_founder_updates
                })}
            />
            <Toggle
              id="5mins"
              description="5 minutes to the next meeting"
              value={!disableNotification}
              onClick={() => setDisableNotification(!disableNotification)}
            />
          </div>
          <div className={styles.row2}>
            <Toggle id="experimental" description="Experimental features" />
            <div className={styles.line} />
            <div className={styles.accountSettings}>Account Settings</div>
            <div className={styles.line} />
            {profile.founder && (
              <Toggle
                id="founder-visible"
                description="Founder profile visible in Surf"
                value={rolesToHide.founder}
                onClick={() => setRolesToHide({ ...rolesToHide, founder: !rolesToHide.founder })}
              />
            )}
            {profile.investor && (
              <Toggle
                id="investor-visible"
                description="Investor profile visible in Surf"
                value={rolesToHide.investor}
                onClick={() => setRolesToHide({ ...rolesToHide, investor: !rolesToHide.investor })}
              />
            )}
            <div className={styles.line} />
            <div
              className={styles.icons}
              onClick={showMyProfile}
            >
              <div className={styles.icon}><EyeBlackIcon /></div>
              <div>How others see your profile</div>
            </div>
            <div className={styles.icons} onClick={() => dispatch(signOut())}>
              <div className={styles.icon}><LogOutIcon /></div>
              <div>Log out</div>
            </div>
            <div
              className={cn(styles.icons, styles.delete)}
              onClick={() => dispatch(deleteMyUser(profile.uid as string))}
            >
              <div className={styles.icon}><DeleteIcon /></div>
              <div>Delete all data</div>
            </div>
          </div>
        </div>
        <div className={styles.buttons}>
          <div className={styles.save}>
            <Button title="Save" onClick={save} isLoading={isLoading} />
          </div>
          <div>
            <Button title="Close" onClick={onClose} />
          </div>
        </div>
      </div>
    </Modal>
  )
}
