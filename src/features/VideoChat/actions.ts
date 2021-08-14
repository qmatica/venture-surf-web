import { Room } from 'twilio-video'

export const actions = {
  setRoom: (room: Room | null) => ({ type: 'VIDEO_CHAT__OPEN', payload: { room } } as const)
}
