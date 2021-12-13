import React, { FC, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'common/types'
import { ProfileType } from 'features/Profile/types'
import { Checkbox } from '@material-ui/core'
import { UserIcon } from 'common/icons'
import { Button } from 'common/components/Button'
import { recommendUser } from 'features/Contacts/actions'
import styles from './styles.module.sass'
import { Input } from '../../common/components/Input'

interface IRecommend {
  uid: string
  onClose: () => void
}

export const Recommend: FC<IRecommend> = ({ uid, onClose }) => {
  const dispatch = useDispatch()
  const { profile } = useSelector((state: RootState) => state.profile) as { profile: ProfileType }

  const users = Object.keys(profile.mutuals).filter((u) => u !== uid)

  const [selectedUsers, setSelectedUsers] = useState<string[]>(users)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const updateSelectedUsers = (uid: string) => {
    if (selectedUsers.includes(uid)) {
      setSelectedUsers(selectedUsers.filter((u) => u !== uid))
      return
    }
    setSelectedUsers([...selectedUsers, uid])
  }

  const onRecommend = () => {
    setIsLoading(true)
    dispatch(recommendUser(
      uid,
      selectedUsers,
      message,
      () => {
        onClose()
        setIsLoading(false)
      }
    ))
  }

  if (!users.length) {
    return (
      <>You dont have mutuals</>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <Input name="Recommend" placeholder="Type your recommend message" value={message} onChange={setMessage} />
      </div>
      {users.map((u) => {
        const {
          photoURL, displayName, first_name, last_name
        } = profile.mutuals[u]

        const userName = displayName || `${first_name} ${last_name}`

        return (
          <div className={styles.userContainer} onClick={() => updateSelectedUsers(u)}>
            <div className={styles.checkboxContainer}>
              <Checkbox checked={selectedUsers.includes(u)} />
            </div>
            <div className={`${styles.photoContainer} ${!photoURL && styles.noPhoto}`}>
              {photoURL ? <img src={photoURL} alt={userName} /> : <UserIcon />}
            </div>
            <div className={styles.userName}>{userName}</div>
          </div>
        )
      })}
      <div>
        <Button title="Send recommendation" onClick={onRecommend} icon="people" isLoading={isLoading} disabled={isLoading} />
      </div>
    </div>
  )
}
