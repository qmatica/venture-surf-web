import React, {
  createRef, FC, useEffect, useMemo, useState
} from 'react'
import {
  Participant as ParticipantType,
  Room as RoomType,
  Track as TrackType,
  LocalDataTrack as LocalDataTrackType
} from 'twilio-video'
import { usePrevious } from 'common/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'features/Modal'
import { getAllContacts } from 'features/Contacts/selectors'
import { actions as profileActions } from 'features/Profile/actions'
import { Participant } from '../Participant'
import { NavBar } from '../NavBar'
import { actions } from '../../actions'
import styles from './styles.module.sass'

interface IRoom {
  room: RoomType
  localDataTrack: LocalDataTrackType
}

export const Room: FC<IRoom> = ({ room, localDataTrack }) => {
  const dispatch = useDispatch()
  const dominantVideoRef = createRef<HTMLVideoElement>()

  const prevState = usePrevious({ room })

  const [participants, setParticipants] = useState<{ [key: string]: ParticipantType }>({
    [room.localParticipant.sid]: room.localParticipant
  })
  const [sidDominantSpeakerParticipant, setSidDominantSpeakerParticipant] = useState<string>('')

  const allContacts = useSelector(getAllContacts)
  const formattedAllContacts = useMemo(() => Object.values(allContacts).reduce((prevState, nextItem) =>
    ({ ...prevState, ...nextItem }), {}), [allContacts])

  useEffect(() => {
    if (room) {
      if (prevState && prevState.room) {
        if (prevState.room !== room) {
          setParticipants({
            [room.localParticipant.sid]: room.localParticipant
          })

          roomListeners(prevState.room, 'off')
        }
      }

      roomListeners(room, 'on')
      room.participants.forEach(participantConnected)
    }
  }, [room])

  const roomListeners = (room: RoomType | any, action: 'on' | 'off') => {
    room[action]('participantConnected', participantConnected)
    room[action]('participantDisconnected', participantDisconnected)
    room[action]('trackSubscribed', subscribedTracks)
    // room[action]('disconnected', roomDisconnected)
    room[action]('dominantSpeakerChanged', dominantSpeakerChanged)
  }

  const allParticipants = useMemo(() => Object.entries(participants).map(([sid, participant], i, arr) => {
    const { identity } = participant
    const user = formattedAllContacts && formattedAllContacts[identity]

    const name = user ? user.displayName || `${user.first_name} ${user.last_name}` : ''

    return (
      <Participant
        key={`${sid}-list`}
        participant={participant}
        userName={name}
        dominantVideoRef={dominantVideoRef}
        isDominant={arr.length === 1 || sidDominantSpeakerParticipant === participant.sid}
        muted={room.localParticipant.sid === participant.sid}
        isHidden={arr.length === 1}
      />
    )
  }), [participants, sidDominantSpeakerParticipant, dominantVideoRef])

  const leave = () => {
    room?.disconnect()
    dispatch(actions.reset())
    dispatch(profileActions.updateMySlots('del', 'now'))
  }

  const participantConnected = (participant: ParticipantType) => {
    setParticipants((prevParticipants) => {
      if (prevParticipants[participant.sid]) return prevParticipants

      return {
        ...prevParticipants,
        [participant.sid]: participant
      }
    })
  }

  const participantDisconnected = (participant: ParticipantType) => {
    setParticipants((prevParticipants) => {
      if (!prevParticipants[participant.sid]) return prevParticipants

      const updatedParticipants = { ...prevParticipants }
      delete updatedParticipants[participant.sid]
      return updatedParticipants
    })
  }

  const dominantSpeakerChanged = (participant: ParticipantType) => {
    console.log('dominantSpeakerChanged', participant)

    if (!participant) return

    localDataTrack.send(participant.sid)

    setSidDominantSpeaker(participant.sid)
  }

  const setSidDominantSpeaker = (sid: string) => {
    setSidDominantSpeakerParticipant((prevSidSpeakerParticipant) => {
      if (prevSidSpeakerParticipant === sid) return prevSidSpeakerParticipant
      return sid
    })
  }

  // define local dominant speaker
  const subscribedTracks = (track: TrackType) => {
    let sidCountDominantSpeaker = {} as { [sid: string]: number }
    track.on('message', (sidDominantSpeaker) => {
      console.log('subscribedTracks - sidDominantSpeaker: ', sidDominantSpeaker)

      if (!sidCountDominantSpeaker[sidDominantSpeaker]) {
        sidCountDominantSpeaker = {}
      }

      sidCountDominantSpeaker[sidDominantSpeaker] = sidCountDominantSpeaker[sidDominantSpeaker]
        ? sidCountDominantSpeaker[sidDominantSpeaker] + 1
        : 1

      // if all participants send my local sid
      if (sidCountDominantSpeaker[sidDominantSpeaker] >= Object.keys(participants).length - 1) {
        setSidDominantSpeaker(sidDominantSpeaker)
      }
    })
  }

  // const roomDisconnected = () => {
  //   if (isOwnerCall) dispatch(sendCallSummary(room?.sid as string))
  // }

  const dominantName =
    formattedAllContacts
    && sidDominantSpeakerParticipant
    && formattedAllContacts[participants[sidDominantSpeakerParticipant].identity]?.displayName

  return (
    <Modal
      title="Video conversation"
      isOpen
      onClose={leave}
      width="calc(100vw - 100px)"
    >
      <div className={styles.container}>
        <div className={styles.participantsContainer}>
          {allParticipants}
        </div>
        <div className={styles.dominantParticipantContainer}>
          <div className={styles.dominantName}>{dominantName}</div>
          <video ref={dominantVideoRef} autoPlay />
        </div>
        <NavBar localParticipant={room.localParticipant} onLeave={leave} />
      </div>
    </Modal>
  )
}
