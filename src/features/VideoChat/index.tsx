import { Participant as ParticipantType } from 'twilio-video'
import { Modal } from 'features/Modal'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'common/types'
import { Participant } from './components/Participant'
import { actions } from './actions'
import styles from './styles.module.sass'

export const VideoChat = () => {
  const { room } = useSelector((state: RootState) => state.videoChat)
  const dispatch = useDispatch()

  const [isOpenModal, setIsOpenModal] = useState(false)
  const [participants, setParticipants] = useState<ParticipantType[]>([])

  const toggleModal = () => {
    setIsOpenModal(!isOpenModal)
    room?.disconnect()
  }

  const participantConnected = (participant: ParticipantType) => {
    setParticipants((prevParticipants) => [...prevParticipants, participant])
  }

  const participantDisconnected = (participant: ParticipantType) => {
    setParticipants((prevParticipants) => prevParticipants.filter((p) => p !== participant))
  }

  useEffect(() => {
    if (!isOpenModal) setIsOpenModal(true)

    if (room) {
      room.on('participantConnected', participantConnected)
      room.on('participantDisconnected', participantDisconnected)
      room.participants.forEach(participantConnected)
    }
    return () => {
      if (room) {
        room.off('participantConnected', participantConnected)
        room.off('participantDisconnected', participantDisconnected)
      }
    }
  }, [room])

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ))

  if (!room) return null

  return (
    <Modal title="Video chat" isOpen={isOpenModal} onClose={toggleModal} width={935}>
      <>
        <Participant key={room.localParticipant.sid} participant={room.localParticipant} />
        {remoteParticipants}
      </>
    </Modal>
  )
}
