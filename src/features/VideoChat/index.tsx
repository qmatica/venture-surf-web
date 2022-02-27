import { Participant as ParticipantType } from 'twilio-video'
import { Modal } from 'features/Modal'
import React, {
  createRef, useEffect, useMemo, useState
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'common/types'
import { getAllContacts } from 'features/Contacts/selectors'
import { actions as profileActions, declineCall, sendCallSummary } from 'features/Profile/actions'
import { UserType } from 'features/User/types'
import { usePrevious } from 'common/hooks'
import { Participant } from './components/Participant'
import { actions } from './actions'
import styles from './styles.module.sass'
import { NavBar } from './components/NavBar'

export const VideoChat = () => {
  const dispatch = useDispatch()
  const dominantVideoRef = createRef<HTMLVideoElement>()

  const allContacts = useSelector(getAllContacts)
  const { room, viewEndCallAll, isOwnerCall } = useSelector((state: RootState) => state.videoChat)

  const prevState = usePrevious({ room })

  const [participants, setParticipants] = useState<{ [key: string]: ParticipantType }>({})
  const [dominantSpeakerParticipant, setDominantSpeakerParticipant] = useState<ParticipantType | null>(null)

  const formattedAllContacts = useMemo(() => Object.values(allContacts).reduce((prevState, nextItem) =>
    ({ ...prevState, ...nextItem }), {}), [allContacts])

  const leave = () => {
    room?.disconnect()
    dispatch(actions.reset())
    dispatch(profileActions.updateMySlots('del', 'now'))
  }

  // const endCallAll = () => {
  //   if (remoteUserUid) dispatch(declineCall(remoteUserUid))
  // }

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
    setDominantSpeakerParticipant((prevParticipant) => {
      if (prevParticipant && participant && prevParticipant.sid === participant.sid) return prevParticipant
      return participant
    })
  }

  const roomDisconnected = () => {
    if (isOwnerCall) dispatch(sendCallSummary(room?.sid as string))
  }

  useEffect(() => {
    if (room) {
      if (prevState && prevState.room) {
        if (prevState.room !== room) {
          setParticipants({})

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

  if (!room) return null

  const dominantName = dominantSpeakerParticipant
    && formattedAllContacts
    && formattedAllContacts[dominantSpeakerParticipant.identity]?.displayName

  return (
    <Modal
      title="Video conversation"
      isOpen={!!room}
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
