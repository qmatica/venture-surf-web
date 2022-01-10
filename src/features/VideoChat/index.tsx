import { Participant as ParticipantType } from 'twilio-video'
import { Modal } from 'features/Modal'
import React, { createRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'common/types'
import { actions as profileActions, declineCall } from 'features/Profile/actions'
import { Participant } from './components/Participant'
import { actions } from './actions'
import styles from './styles.module.sass'
import { NavBar } from './components/NavBar'

export const VideoChat = () => {
  const { room, remoteUserUid, viewEndCallAll } = useSelector((state: RootState) => state.videoChat)

  const dispatch = useDispatch()
  const videoContainerRef = createRef<HTMLDivElement>()

  const [isOpenModal, setIsOpenModal] = useState(false)
  const [participants, setParticipants] = useState<ParticipantType[]>([])
  const [dominantSpeakerParticipant, setDominantSpeakerParticipant] = useState<ParticipantType | null>(null)

  const toggleModal = () => {
    setIsOpenModal(!isOpenModal)
    room?.disconnect()
  }

  // const endCallAll = () => {
  //   if (remoteUserUid) dispatch(declineCall(remoteUserUid))
  // }

  const participantConnected = (participant: ParticipantType) => {
    setDominantSpeakerParticipant(participant)
    setParticipants((prevParticipants) => [...prevParticipants, participant])
  }

  const participantDisconnected = (participant: ParticipantType) => {
    setParticipants((prevParticipants) => prevParticipants.filter((p) => p !== participant))
  }

  const dominantSpeakerChanged = (participant: ParticipantType) => {
    console.log('dominantSpeakerChanged', participant)
    setDominantSpeakerParticipant(participant)
  }

  useEffect(() => {
    if (room && !isOpenModal) setIsOpenModal(true)
    if (!room && isOpenModal) {
      setIsOpenModal(false)
      setParticipants([])
    }

    if (room) {
      dominantSpeakerChanged(room.localParticipant)
      room.on('participantConnected', participantConnected)
      room.on('participantDisconnected', participantDisconnected)
      room.on('dominantSpeakerChanged', dominantSpeakerChanged)
      room.participants.forEach(participantConnected)
    }
    return () => {
      if (room) {
        room.off('participantConnected', participantConnected)
        room.off('participantDisconnected', participantDisconnected)
        room.off('dominantSpeakerChanged', dominantSpeakerChanged)
      }
    }
  }, [room])

  useEffect(() => {
    if (!isOpenModal) {
      dispatch(actions.reset())
      dispatch(profileActions.updateMySlots('del', 'now'))
      setParticipants([])
    }
  }, [isOpenModal])

  if (!room) return null

  const allParticipants = [room.localParticipant, ...participants].map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ))

  return (
    <Modal
      title="Video conversation"
      isOpen={isOpenModal}
      onClose={toggleModal}
      width="calc(100vw - 100px)"
    >
      <div
        className={styles.container}
        ref={videoContainerRef}
      >
        <div className={styles.participantsContainer}>
          {allParticipants}
        </div>
        <div className={styles.dominantParticipantContainer}>
          {dominantSpeakerParticipant && (
          <Participant key={dominantSpeakerParticipant.sid} participant={dominantSpeakerParticipant} />
          )}
        </div>
        <NavBar localParticipant={room.localParticipant} onLeave={toggleModal} />
      </div>
    </Modal>
  )
}
