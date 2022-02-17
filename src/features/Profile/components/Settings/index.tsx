import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'
import { Button } from 'common/components/Button'
import { Modal } from 'features/Modal'
import { SwitchRoles } from 'features/Profile/components/SwitchRoles'
import { getMyProfile } from 'features/Profile/selectors'
import { DeleteIcon, EyeBlackIcon } from 'common/icons'
import { updateMyProfile } from 'features/Profile/actions'
import { Toggle } from './Toggle'
import styles from './styles.module.sass'

interface ISettings {
  isOpen: boolean
  onClose: () => void
}

export const SettingsEdit: FC<ISettings> = ({ isOpen, onClose }) => {
  const profile = useSelector(getMyProfile)
  const [selectedSettings, setSelectedSettings] = useState({ ...profile?.settings })
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) setSelectedSettings({ ...profile?.settings })
  }, [isOpen])

  const save = () => {
    setIsLoading(true)

    const onFinish = () => {
      onClose()
      setIsLoading(false)
    }

    dispatch(updateMyProfile({ settings: selectedSettings }, onFinish))
  }

  if (!profile) return null

  const createdRoles = {
    founder: !!profile.founder,
    investor: !!profile.investor
  }
  return (
    <Modal title="Settings" onClose={onClose} isOpen={isOpen}>
      <>
        <div className={styles.container}>
          <div className={styles.row1}>
            <div className={styles.business}>
              {(!createdRoles.founder || !createdRoles.investor)
              && <div className={styles.subTitle}>Business page</div>}
              <SwitchRoles
                activeRole={profile.activeRole}
                createdRoles={createdRoles}
                isEdit
                customButton
                roles={profile.roles}
              />
            </div>
            <Toggle
              id="voice-calls"
              description="Allow unscheduled voice calls from my network"
              value={selectedSettings.disable_instant_calls}
              onClick={() =>
                setSelectedSettings({
                  ...selectedSettings,
                  disable_instant_calls: !selectedSettings.disable_instant_calls
                })}
            />
            <div className={cn(styles.subTitle, styles.separator)}>Notifications</div>
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
            />
          </div>
          <div className={styles.row2}>
            <Toggle id="experimental" description="experimental features" />
            <div className={styles.accountSettings}>Account Settings</div>
            <Toggle
              id="visible"
              description="Founder profile visible in Surf"
            />
            <div className={styles.icons}>
              <div className={styles.icon}><EyeBlackIcon /></div>
              <div>How others see your profile</div>
            </div>
            <div className={styles.icons}>
              <div className={styles.icon}><EyeBlackIcon /></div>
              <div>Log out</div>
            </div>
            <div className={cn(styles.icons, styles.delete)}>
              <div className={styles.icon}><DeleteIcon /></div>
              <div>Delete all data</div>
            </div>
          </div>
        </div>
        <div className={styles.buttons}>
          <Button title="Save" onClick={save} isLoading={isLoading} />
          <Button title="Close" onClick={onClose} />
        </div>
      </>
    </Modal>
  )
}
