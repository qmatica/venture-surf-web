import React, {
  ChangeEvent, FC, useRef, useState
} from 'react'
import { useDispatch } from 'react-redux'
import cn from 'classnames'
import { UserPhotoIcon, PreloaderIcon, LoadingSkeleton } from 'common/icons'
import { Modal } from 'features/Modal'
import { getImageSrcFromBase64 } from 'common/utils'
import { Button } from 'common/components/Button'
import {
  actions as actionsNotifications
} from 'features/Notifications/actions'
import {
  actions as actionsProfile
} from 'features/Profile/actions'
import { profileAPI } from 'api'
import { ProfileType } from '../../types'
import styles from './styles.module.sass'

interface IAvatar {
  profile: ProfileType
  myUid: string
}

export const Avatar: FC<IAvatar> = ({ profile, myUid }) => {
  const dispatch = useDispatch()
  const [isEdit, setIsEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(!profile.photoURL)
  const inputFile = useRef<HTMLInputElement | null>(null)
  const isAuthenticated = myUid === profile.uid

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
      const response = await profileAPI.updateProfilePhoto(file)
      dispatch(actionsProfile.updateMyProfilePhoto(response.photoURL))
    } catch (err) {
      dispatch(actionsNotifications.addErrorMsg(JSON.stringify(err)))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div
        className={cn(
          styles.photoContainer,
          !isAuthenticated && styles.photoContainerDisabled
        )}
        onClick={onToggleEdit}
      >
        {!isImageLoaded && <div><LoadingSkeleton /></div>}
        {(isLoading && <PreloaderIcon />) ||
          (profile.photoURL || profile.photoBase64
            ? (
              <img
                src={getImageSrcFromBase64(profile.photoBase64, profile.photoURL)}
                alt={`${profile.first_name} ${profile.last_name}`}
                className={isImageLoaded ? styles.visible : styles.hidden}
                onLoad={() => setIsImageLoaded(true)}
              />
            )
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
