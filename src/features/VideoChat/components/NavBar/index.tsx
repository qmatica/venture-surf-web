import React, { FC, useState } from 'react'
import { LocalParticipant as LocalParticipantType, LocalVideoTrack } from 'twilio-video'
import { Button } from 'common/components/Button'
import { Image } from 'common/components/Image'
import { useDispatch, useSelector } from 'react-redux'
import { getMutuals } from 'features/Contacts/selectors'
import { MapParticipantsType } from 'features/VideoChat/types'
import {
  MicIcon, MicOffIcon, UserPhotoIcon, VideoIcon2, VideoOffIcon2
} from 'common/icons'
import cn from 'classnames'
import { usersAPI } from 'api'
import { actions as actionsNotifications } from 'features/Notifications/actions'
import styles from './styles.module.sass'

interface INavbar {
  localParticipant: LocalParticipantType
  onLeave: () => void
  participants: MapParticipantsType
}

export const NavBar: FC<INavbar> = ({ localParticipant, onLeave, participants }) => {
  const [isEnabledMultimedia, setIsEnabledMultimedia] = useState({
    videoTracks: true,
    audioTracks: true
  })
  const [isActiveListMembers, setIsActiveListMembers] = useState(false)

  const toggleMultimedia = (kindMultimedia: 'audioTracks' | 'videoTracks') => {
    setIsEnabledMultimedia({
      ...isEnabledMultimedia,
      [kindMultimedia]: !isEnabledMultimedia[kindMultimedia]
    })

    localParticipant[kindMultimedia].forEach((t) => {
      if (isEnabledMultimedia[kindMultimedia]) {
        t.track.disable()
        return
      }
      t.track.enable()
    })
  }

  const onScreenSharing = () => {
    // @ts-ignore
    navigator.mediaDevices.getDisplayMedia().then((stream) => {
      const screenTrack = new LocalVideoTrack(stream.getTracks()[0])
      localParticipant.publishTrack(screenTrack)
    }).catch(() => {
      alert('Could not share the screen.')
    })
  }

  return (
    <div className={styles.navBarContainer}>
      <div>
        <ButtonMultimedia
          isActive={isEnabledMultimedia.audioTracks}
          icon="audio"
          title={isEnabledMultimedia.audioTracks ? 'Mute' : 'Unmute'}
          onClick={() => toggleMultimedia('audioTracks')}
        />
        <ButtonMultimedia
          isActive={isEnabledMultimedia.videoTracks}
          icon="video"
          title={isEnabledMultimedia.videoTracks ? 'Off video' : 'On video'}
          onClick={() => toggleMultimedia('videoTracks')}
        />
      </div>
      <div>
        <Button
          title="Screen sharing"
          className={styles.screenSharing}
          onClick={onScreenSharing}
        />
        <div className={styles.addMembersContainer}>
          <Button
            title="Add members"
            onClick={() => setIsActiveListMembers(!isActiveListMembers)}
            className={cn(styles.addMembers, isActiveListMembers && styles.active)}
          />
          <ListMembers participants={participants} isActive={isActiveListMembers} />
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

interface IListMembers {
  isActive: boolean
  participants: MapParticipantsType
}

const ListMembers: FC<IListMembers> = ({ isActive = false, participants }) => {
  const dispatch = useDispatch()
  const mutuals = useSelector(getMutuals)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState<string | null>(null)

  if (!isActive) return null

  const invite = async (uid: string) => {
    setLoading(uid)
    const deviceId = localStorage.getItem('deviceId') as string

    usersAPI.inviteInVideoRoom(uid, deviceId, 'now')
      .then((res) => {
        console.log(res)
        setLoading(null)
      })
      .catch((err) => {
        dispatch(actionsNotifications.addErrorMsg(JSON.stringify(err)))
      })
  }

  const list = mutuals?.filter((m) => !Object.values(participants).find((p) => p.identity === m.uid)).map((user) => {
    const name = user.displayName || `${user.first_name} ${user.last_name}`
    if (!name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) return null

    return (
      <div className={styles.item} key={user.uid}>
        <div>
          <div className={styles.userPhotoContainer}>
            <Image
              photoURL={user.photoURL}
              photoBase64={user.photoBase64}
              alt={name}
              userIcon={UserPhotoIcon}
            />
          </div>
          <div className={styles.name}>{name}</div>
        </div>
        <Button
          title="Invite"
          onClick={() => invite(user.uid)}
          isLoading={loading === user.uid}
          disabled={!!loading}
        />
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
