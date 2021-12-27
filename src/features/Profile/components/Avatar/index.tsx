import React, {
  ChangeEvent, FC, useRef, useState
} from 'react'
import { UserPhotoIcon, PreloaderIcon } from 'common/icons'
import { Modal } from 'features/Modal'
import { getFirebase } from 'react-redux-firebase'
import { getImageSrcFromBase64 } from 'common/utils'
import { AuthUserType } from 'common/types'
import { ProfileType } from '../../types'
import { profileAPI } from '../../../../api'
import styles from './styles.module.sass'

interface IAvatar {
  profile: ProfileType
}

export const Avatar: FC<IAvatar> = ({ profile }) => {
  const [isEdit, setIsEdit] = useState(false)
  const [photoUrl, setPhotoUrl] = useState(profile?.photoURL)
  const [isLoading, setIsLoading] = useState(false)
  const inputFile = useRef<HTMLInputElement | null>(null)

  const onToggleEdit = () => {
    if (!profile.photoURL && !profile.photoBase64) {
      inputFile.current?.click()
      return
    }
    setIsEdit(!isEdit)
  }

  const onChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    e.preventDefault()
    if (e.target.files == null) {
      throw new Error('Error finding e.target.files')
    }
    const file = e.target.files[0]
    setIsLoading(true)
    const res = await profileAPI.updateProfilePhoto(file)
    setPhotoUrl(res.photoURL)
    setIsLoading(false)
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
        <Modal onClose={onToggleEdit} isOpen={isEdit} title="Edit photo profile" width="auto">
          <>
            <div
              onClick={() => {
                inputFile.current?.click()
                onToggleEdit()
              }}
              style={{ cursor: 'pointer' }}
            >Load photo
            </div>
          </>
        </Modal>
      )}
    </>
  )
}
