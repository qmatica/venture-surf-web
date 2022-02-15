import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from 'common/components/Button'
import { Modal } from 'features/Modal'
import { Input } from 'common/components/Input'
import { FieldValues, useForm } from 'react-hook-form'
import { SwitchRoles } from 'features/Profile/components/SwitchRoles'
import { Toggle } from './Toggle'
import { updateMyProfile } from '../../actions'
import styles from './styles.module.sass'
import { getMyProfile } from '../../../../features/Profile/selectors'
import { PlusIcon } from '../../../../common/icons'

interface ISettings {
  isOpen: boolean
  onClose: () => void
}

export const SettingsEdit: FC<ISettings> = ({ isOpen, onClose }) => {
  const profile = useSelector(getMyProfile)

  const dispatch = useDispatch()
  const {
    register, handleSubmit, formState: { errors }, reset
  } = useForm()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) reset()
  }, [isOpen])

  const save = (values: FieldValues) => {
    if (!values) return
    setIsLoading(true)

    const onFinish = () => {
      onClose()
      setIsLoading(false)
    }

    dispatch(updateMyProfile({ job: values }, onFinish))
  }

  if (!profile) return null

  const createdRoles = {
    founder: !!profile.founder,
    investor: !!profile.investor
  }
  return (
    <Modal title="Settings" onClose={onClose} isOpen={isOpen}>
      <form onSubmit={handleSubmit(save)}>
        <div className={styles.container}>
          <div className={styles.row1}>
            <div className={styles.bussiness}>
              <div><b>Bussiness page</b></div>
              <SwitchRoles
                activeRole={profile.activeRole}
                createdRoles={createdRoles}
                isEdit
                roles={profile.roles}
              />
            </div>
            <Toggle id="voice-calls" discription="discription" />
            <div><b>Notifications</b></div>
            <Toggle id="requests" discription="discription" />
            <Toggle id="updates" discription="discription" />
            <Toggle id="5mins" discription="discription" />
          </div>
          <div className={styles.row2}>
            row 2
          </div>
        </div>
        <div className={styles.buttons}>
          <Button title="Save" type="submit" isLoading={isLoading} />
          <Button title="Close" onClick={onClose} />
        </div>

      </form>
    </Modal>
  )
}
