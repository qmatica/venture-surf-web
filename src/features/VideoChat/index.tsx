import React from 'react'
import { useSelector } from 'react-redux'
import { Room } from './components/Room'
import { getVideoChat } from './selectors'

export const VideoChat = () => {
  const {
    room, localDataTrack, viewEndCallAll, isMyProfileIsOwnerOutgoingCall
  } = useSelector(getVideoChat)

  if (!room) return null
  if (!localDataTrack) return null

  return (
    <Room
      room={room}
      localDataTrack={localDataTrack}
      isMyProfileIsOwnerOutgoingCall={isMyProfileIsOwnerOutgoingCall}
    />
  )
}
