import React, {
  createRef, FC, useEffect, useMemo, useState
} from 'react'
import { Participant as ParticipantType, Room as RoomType } from 'twilio-video'
import { usePrevious } from 'common/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'features/Modal'
import { getAllContacts } from 'features/Contacts/selectors'
import { actions as profileActions } from 'features/Profile/actions'
import { actions } from '../../actions'
import styles from './styles.module.sass'
import { Participant } from '../Participant'
import { NavBar } from '../NavBar'

interface IRoom {
  room: RoomType
}

export const Room: FC<IRoom> = ({ room }) => {
  const dispatch = useDispatch()
  const dominantVideoRef = createRef<HTMLVideoElement>()

  const prevState = usePrevious({ room })

  const [participants, setParticipants] = useState<{ [key: string]: ParticipantType }>({
    [room.localParticipant.sid]: room.localParticipant
  })
  const [dominantSpeakerParticipant, setDominantSpeakerParticipant] = useState<ParticipantType | null>(null)

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

          prevState.room.off('participantConnected', participantConnected)
          prevState.room.off('participantDisconnected', participantDisconnected)
          // prevState.room.off('disconnected', roomDisconnected)
          prevState.room.off('dominantSpeakerChanged', dominantSpeakerChanged)
        }
      }

      room.on('participantConnected', participantConnected)
      room.on('participantDisconnected', participantDisconnected)
      // room.on('disconnected', roomDisconnected)
      room.on('dominantSpeakerChanged', dominantSpeakerChanged)
      room.participants.forEach(participantConnected)
    }
  }, [room])

  const allParticipants = useMemo(() => Object.entries(participants).map(([sid, participant]) => {
    const { identity } = participant
    const user = formattedAllContacts && formattedAllContacts[identity]

    const name = user ? user.displayName || `${user.first_name} ${user.last_name}` : ''

    return (
      <Participant
        key={`${sid}-list`}
        participant={participant}
        userName={name}
        dominantVideoRef={dominantVideoRef}
        isDominant={dominantSpeakerParticipant?.sid === participant.sid}
      />
    )
  }), [participants, dominantSpeakerParticipant, dominantVideoRef])

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
    setDominantSpeakerParticipant((prevSpeakerParticipant) => {
      if (
        prevSpeakerParticipant
        && participant
        && prevSpeakerParticipant.sid === participant.sid
      ) return prevSpeakerParticipant
      return participant
    })
  }

  // const roomDisconnected = () => {
  //   if (isOwnerCall) dispatch(sendCallSummary(room?.sid as string))
  // }

  const dominantName = dominantSpeakerParticipant
    && formattedAllContacts
    && formattedAllContacts[dominantSpeakerParticipant.identity]?.displayName

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
