import { Room } from 'twilio-video'

export const actions = {
  setRoom: (room: Room | null, remoteUserUid: string | null) => ({ type: 'VIDEO_CHAT__OPEN', payload: { room, remoteUserUid } } as const)
}
