import React, {
  ChangeEvent, FC, useRef, useState
} from 'react'
import { UserPhotoIcon } from 'common/icons'
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

    // TODO: Неработает загрузка фото (возможно из-за настроек на бэкенде)
    // const res = await profileAPI.updateProfilePhoto(file)
    // console.log(res)

    const data = new FormData()
    data.append('fileName', file)

    const authUser = getFirebase().auth().currentUser?.toJSON() as AuthUserType | undefined
    if (!authUser) return

    fetch('https://us-central1-venturesurfdev.cloudfunctions.net/api/user/photo', {
      mode: 'no-cors',
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        Authorization: `Bearer ${authUser.stsTokenManager.accessToken}`,
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        type: 'formData'
      },
      body: data
    }).then((res: any) => {
      console.log(res.data)
    })
  }

  return (
    <>
      <div className={styles.photoContainer} onClick={onToggleEdit}>
        {profile.photoURL || profile.photoBase64
          ? <img src={getImageSrcFromBase64(profile.photoBase64, profile.photoURL)} alt={`${profile.first_name} ${profile.last_name}`} />
          : <UserPhotoIcon />}
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
            <div>Load photo</div>
          </>
        </Modal>
      )}
    </>
  )
}
