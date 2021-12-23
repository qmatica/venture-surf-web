import { Participant as ParticipantType } from 'twilio-video'
import { Modal } from 'features/Modal'
import React, { createRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'common/types'
import { actions as profileActions, declineCall } from 'features/Profile/actions'
import { Button } from 'common/components/Button'
import { Participant } from './components/Participant'
import { actions } from './actions'
import styles from './styles.module.sass'

export const VideoChat = () => {
  const { room, remoteUserUid, viewEndCallAll } = useSelector((state: RootState) => state.videoChat)
  const dispatch = useDispatch()
  const videoContainerRef = createRef<HTMLDivElement>()

  const [isOpenModal, setIsOpenModal] = useState(false)
  const [participants, setParticipants] = useState<ParticipantType[]>([])
  const [styleLocalParticipant, setStyleLocalParticipant] = useState<{[key: string]: any} | undefined>()
  const [heightContainer, setHeightContainer] = useState<number | undefined>()

  const toggleModal = () => {
    setIsOpenModal(!isOpenModal)
    room?.disconnect()
  }

  // const endCallAll = () => {
  //   if (remoteUserUid) dispatch(declineCall(remoteUserUid))
  // }

  const participantConnected = (participant: ParticipantType) => {
    if (!heightContainer) {
      setHeightContainer(videoContainerRef.current?.offsetHeight)
    }
    if (!styleLocalParticipant) {
      setStyleLocalParticipant({
        width: '218px',
        position: 'absolute',
        top: 0,
        left: 0
      })
    }
    setParticipants((prevParticipants) => [...prevParticipants, participant])
  }

  const participantDisconnected = (participant: ParticipantType) => {
    setParticipants((prevParticipants) => prevParticipants.filter((p) => p !== participant))
  }

  useEffect(() => {
    if (room && !isOpenModal) setIsOpenModal(true)
    if (!room && isOpenModal) {
      setIsOpenModal(false)
      setParticipants([])
    }

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

  useEffect(() => {
    if (participants.length === 0 && styleLocalParticipant) {
      setStyleLocalParticipant(undefined)
    }
  }, [participants])

  useEffect(() => {
    if (!isOpenModal) {
      dispatch(actions.reset())
      dispatch(profileActions.updateMySlots('del', 'now'))
      setParticipants([])
    }
  }, [isOpenModal])

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ))

  if (!room) return null

  return (
    <Modal title="Video chat" isOpen={isOpenModal} onClose={toggleModal} width={735}>
      <div
        className={styles.container}
        ref={videoContainerRef}
        style={{
          minHeight: heightContainer || 'auto'
        }}
      >
        <Participant
          key={room.localParticipant.sid}
          participant={room.localParticipant}
          style={styleLocalParticipant}
        />
        {remoteParticipants}
        {/*{viewEndCallAll && (*/}
        {/*  <Button title="End call for all" className={styles.button} onClick={endCallAll} />*/}
        {/*)}*/}
      </div>
    </Modal>
  )
}
