import { Room } from 'twilio-video'
import { NotificationType } from './types'

export const actions = {
  setRoom: (room: Room | null, remoteUserUid: string | null) => ({ type: 'VIDEO_CHAT__OPEN', payload: { room, remoteUserUid } } as const),
  setNotification: (notification: NotificationType) => ({ type: 'VIDEO_CHAT__SET_NOTIFICATION', notification } as const),
  clearNotification: (notificationRequest: string) => ({ type: 'VIDEO_CHAT__CLEAR_NOTIFICATION', notificationRequest } as const)
}
