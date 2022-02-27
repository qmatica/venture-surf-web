import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'common/types'
import { Room } from './components/Room'

export const VideoChat = () => {
  const { room, viewEndCallAll, isOwnerCall } = useSelector((state: RootState) => state.videoChat)

  if (!room) return null

  return <Room room={room} />
}
