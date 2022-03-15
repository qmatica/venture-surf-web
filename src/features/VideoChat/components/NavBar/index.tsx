import React, { FC, useState } from 'react'
import { LocalParticipant as LocalParticipantType, LocalVideoTrack } from 'twilio-video'
import { Button } from 'common/components/Button'
import { Image } from 'common/components/Image'
import { useDispatch, useSelector } from 'react-redux'
import { getMutuals } from 'features/Contacts/selectors'
import { MapParticipantsType } from 'features/VideoChat/types'
import {
  ArrowBottomIcon,
  MicIcon, MicOffIcon, UserPhotoIcon, VideoIcon2, VideoOffIcon2
} from 'common/icons'
import cn from 'classnames'
import { usersAPI } from 'api'
import { actions as actionsNotifications } from 'features/Notifications/actions'
import ReactTooltip from 'react-tooltip'
import { Checkbox } from '@material-ui/core'
import { changeDevice } from 'features/VideoChat/actions'
import { getDevices, getSelectedDevices } from '../../selectors'
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
      // eslint-disable-next-line no-alert
      alert('Could not share the screen.')
      console.log('Could not share the screen.')
    })
  }

  return (
    <div className={styles.navBarContainer}>
      <div>
        <ButtonMultimedia
          isActive={isEnabledMultimedia.audioTracks}
          type="audioinput"
          title={isEnabledMultimedia.audioTracks ? 'Mute' : 'Unmute'}
          onClick={() => toggleMultimedia('audioTracks')}
        />
        <ButtonMultimedia
          isActive={isEnabledMultimedia.videoTracks}
          type="videoinput"
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
  type: 'audioinput' | 'videoinput'
  title: string
  isActive: boolean
  onClick: () => void
}

const ButtonMultimedia: FC<IButtonMultimedia> = ({
  type, title, isActive, onClick
}) => {
  const dispatch = useDispatch()
  const devices = useSelector(getDevices)
  const selectedDevices = useSelector(getSelectedDevices)
  const [isOpenList, setIsOpenList] = useState(false)
  const toggleIsOpenList = () => setIsOpenList(!isOpenList)

  const getIcon = () => {
    switch (type) {
      case 'videoinput': {
        return isActive ? <VideoIcon2 /> : <VideoOffIcon2 />
      }
      case 'audioinput': {
        return isActive ? <MicIcon /> : <MicOffIcon />
      }
      default: return null
    }
  }

  return (
    <div className={styles.buttonMultimediaContainer}>
      <div onClick={onClick}>
        {getIcon()}
        <div className={styles.title}>{title}</div>
      </div>
      <div
        className={cn(styles.arrowBottom, isOpenList && styles.active)}
        data-tip
        data-place="top"
        data-effect="solid"
        data-offset="{'top': 7}"
        data-background-color="#EDEDED"
        data-event="click"
        data-for={`${title}-tip`}
        data-class={styles.devicesTooltip}
      >
        <ArrowBottomIcon />
      </div>
      <ReactTooltip
        id={`${title}-tip`}
        afterShow={toggleIsOpenList}
        afterHide={toggleIsOpenList}
        type="info"
      >
        <div className={styles.devicesContainer}>
          {devices[type]?.map((device) => (
            <div
              key={device.deviceId}
              onClick={() => dispatch(changeDevice(device.kind, device.deviceId))}
              className={styles.device}
            >
              <div className={styles.label}>{device.label}</div>
              <Checkbox
                checked={selectedDevices[device.kind] === device.deviceId}
                style={{ padding: 5 }}
              />
            </div>
          ))}
        </div>
      </ReactTooltip>
    </div>
  )
}
