import React, { FC, useState } from 'react'
import { LocalParticipant as LocalParticipantType } from 'twilio-video'
import { Button } from 'common/components/Button'
import { useSelector } from 'react-redux'
import { getMutuals } from 'features/Contacts/selectors'
import { getImageSrcFromBase64 } from 'common/utils'
import {
  MicIcon, MicOffIcon, UserPhotoIcon, VideoIcon2, VideoOffIcon2
} from 'common/icons'
import cn from 'classnames'
import styles from './styles.module.sass'

interface INavbar {
  localParticipant: LocalParticipantType
  onLeave: () => void
}

export const NavBar: FC<INavbar> = ({ localParticipant, onLeave }) => {
  const [isEnabledMultimedia, setIsEnabledMultimedia] = useState({
    video: true,
    audio: true
  })
  const [isActiveListMembers, setIsActiveListMembers] = useState(false)

  const toggleMultimedia = (multimedia: 'audio' | 'video') => {
    setIsEnabledMultimedia({
      ...isEnabledMultimedia,
      [multimedia]: !isEnabledMultimedia[multimedia]
    })

    const kindMultimedia = multimedia === 'audio' ? 'audioTracks' : 'videoTracks'

    localParticipant[kindMultimedia].forEach((t) => {
      if (isEnabledMultimedia[multimedia]) {
        t.track.disable()
        return
      }
      t.track.enable()
    })
  }

  return (
    <div className={styles.navBarContainer}>
      <div>
        <ButtonMultimedia
          isActive={isEnabledMultimedia.audio}
          icon="audio"
          title={isEnabledMultimedia.audio ? 'Mute' : 'Unmute'}
          onClick={() => toggleMultimedia('audio')}
        />
        <ButtonMultimedia
          isActive={isEnabledMultimedia.video}
          icon="video"
          title={isEnabledMultimedia.video ? 'Off video' : 'On video'}
          onClick={() => toggleMultimedia('video')}
        />
      </div>
      <div>
        <div className={styles.addMembersContainer}>
          <Button
            title="Add members"
            onClick={() => setIsActiveListMembers(!isActiveListMembers)}
            className={cn(styles.addMembers, isActiveListMembers && styles.active)}
          />
          <ListMembers isActive={isActiveListMembers} />
        </div>
        <Button
          title="Leave"
          className={styles.leave}
          onClick={onLeave}
        />
      </div>
    </div>
  )
}

const ListMembers = ({ isActive = false }) => {
  const mutuals = useSelector(getMutuals)
  const [search, setSearch] = useState('')

  if (!isActive) return null

  const list = mutuals?.map((user) => {
    const name = user.displayName || `${user.first_name} ${user.last_name}`

    if (!name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) return null

    return (
      <div className={styles.item} key={user.uid}>
        <div>
          <div className={styles.userPhotoContainer}>
            {user.photoURL || user.photoBase64
              ? <img src={getImageSrcFromBase64(user.photoBase64, user.photoURL)} alt={name} />
              : <UserPhotoIcon />}
          </div>
          <div className={styles.name}>{name}</div>
        </div>
        <Button title="Invite" />
      </div>
    )
  })

  return (
    <div className={styles.listContainer}>
      <div className={styles.inputContainer}>
        <input
          placeholder="Search"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
      </div>
      <div className={styles.listWrapper}>
        {list?.length === 0 || list?.every((i) => i === null) ? <div className={styles.empty}>Empty</div> : list}
      </div>
    </div>
  )
}

interface IButtonMultimedia {
  icon: 'audio' | 'video'
  title: string
  isActive: boolean
  onClick: () => void
}

const ButtonMultimedia: FC<IButtonMultimedia> = ({
  icon, title, isActive, onClick
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'video': {
        return isActive ? <VideoIcon2 /> : <VideoOffIcon2 />
      }
      case 'audio': {
        return isActive ? <MicIcon /> : <MicOffIcon />
      }
      default: return null
    }
  }

  return (
    <div className={styles.buttonMultimediaContainer} onClick={onClick}>
      {getIcon()}
      <div className={styles.title}>{title}</div>
    </div>
  )
}
