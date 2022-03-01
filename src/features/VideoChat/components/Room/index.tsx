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
import { getMyUid } from 'features/Auth/selectors'
import { getMyName } from 'features/Profile/selectors'
import { Participant } from '../Participant'
import { NavBar } from '../NavBar'
import { actions } from '../../actions'
import { MapParticipantsType } from '../../types'
import styles from './styles.module.sass'

interface IRoom {
  room: RoomType
  localDataTrack: LocalDataTrackType
}

export const Room: FC<IRoom> = ({ room, localDataTrack }) => {
  const dispatch = useDispatch()
  const dominantVideoRef = createRef<HTMLVideoElement>()
  const myUid = useSelector(getMyUid)
  const myName = useSelector(getMyName)

  const prevState = usePrevious({ room })

  const [participants, setParticipants] = useState<MapParticipantsType>({
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

    let name = identity === myUid ? myName : ''

    if (!name) {
      const user = formattedAllContacts && formattedAllContacts[identity]

      if (user) {
        name = user.displayName || `${user.first_name} ${user.last_name}`
      }
    }

    const isDominant = arr.length === 1 || (arr.length === 2 && participant.sid !== room.localParticipant.sid)

    return (
      <Participant
        key={`${sid}-list`}
        participant={participant}
        userName={name}
        dominantVideoRef={dominantVideoRef}
        isDominant={isDominant || sidDominantSpeakerParticipant === participant.sid}
        muted={room.localParticipant.sid === participant.sid}
        isHidden={isDominant}
      />
    )
  }), [participants, sidDominantSpeakerParticipant, dominantVideoRef])

  const leave = () => {
    roomListeners(room, 'off')
    room.disconnect()
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
  //   if (isOwnerCall) dispatch(sendCallSummary(room.sid))
  // }

  const getDominantName = () => {
    if (formattedAllContacts) {
      if (sidDominantSpeakerParticipant) {
        if (sidDominantSpeakerParticipant === room.localParticipant.sid) {
          return myName
        }
        return formattedAllContacts[participants[sidDominantSpeakerParticipant]?.identity]?.displayName
      }

      const allParticipants = Object.values(participants)
      if (allParticipants.length === 2) {
        const participant = allParticipants.find((p) => p.sid !== room.localParticipant.sid)

        if (participant) {
          return formattedAllContacts[participant.identity]?.displayName
        }
      }
    }
    return null
  }

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
          <div className={styles.dominantName}>{getDominantName()}</div>
          <video ref={dominantVideoRef} autoPlay />
        </div>
        <NavBar participants={participants} localParticipant={room.localParticipant} onLeave={leave} />
      </div>
    </Modal>
  )
}
