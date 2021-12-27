import React, {
  ChangeEvent, FC, useRef, useState
} from 'react'
import { useDispatch } from 'react-redux'
import { UserPhotoIcon, PreloaderIcon } from 'common/icons'
import { Modal } from 'features/Modal'
import { getFirebase } from 'react-redux-firebase'
import { getImageSrcFromBase64 } from 'common/utils'
import { AuthUserType } from 'common/types'
import { Button } from 'common/components/Button'
import {
  actions as actionsNotifications
} from 'features/Notifications/actions'
import { ProfileType } from '../../types'
import { profileAPI } from '../../../../api'
import styles from './styles.module.sass'

interface IAvatar {
  profile: ProfileType
}

export const Avatar: FC<IAvatar> = ({ profile }) => {
  const dispatch = useDispatch()
  const [isEdit, setIsEdit] = useState(false)
  const [photoUrl, setPhotoUrl] = useState(profile?.photoURL)
  const [isLoading, setIsLoading] = useState(false)
  const inputFile = useRef<HTMLInputElement | null>(null)
  const isAuthenticated = !!getFirebase().auth().currentUser?.toJSON()

  const openEditModal = () => setIsEdit(true)
  const closeEditModal = () => setIsEdit(false)

  const onToggleEdit = () => {
    if (isAuthenticated) {
      if (!profile.photoURL && !profile.photoBase64) {
        inputFile.current?.click()
        return
      }
      openEditModal()
    }
  }

  const onChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    e.preventDefault()
    if (e.target.files == null) {
      throw new Error('Error finding e.target.files')
    }
    const file = e.target.files[0]
    setIsLoading(true)
    try {
      const res = await profileAPI.updateProfilePhoto(file)
      setPhotoUrl(res.photoURL)
    } catch (err) {
      dispatch(actionsNotifications.addErrorMsg(JSON.stringify(err)))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className={styles.photoContainer} onClick={onToggleEdit}>
        {(isLoading && <PreloaderIcon />) ||
          (photoUrl || profile.photoBase64
            ? <img src={getImageSrcFromBase64(profile.photoBase64, photoUrl)} alt={`${profile.first_name} ${profile.last_name}`} />
            : <UserPhotoIcon />)}
      </div>
      <input
        type="file"
        name="file"
        ref={inputFile}
        className={styles.inputFile}
        onChange={onChangeFile}
        accept="image/*"
      />
      {isEdit && (
        <Modal onClose={closeEditModal} isOpen={isEdit} title="Edit photo profile" width="auto">
          <div className={styles.modalContainer}>
            <Button
              title="Load photo"
              onClick={() => {
                inputFile.current?.click()
                closeEditModal()
              }}
              className={styles.button}
            />
            {/* TODO: API for removing the profile photo is not ready */}
            <Button
              title="Remove photo"
              className={styles.button}
            />
          </div>
        </Modal>
      )}
    </>
  )
}
