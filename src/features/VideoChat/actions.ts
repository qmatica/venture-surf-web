import { Room } from 'twilio-video'

export const actions = {
  setRoom: (room: Room | null, remoteUserUid: string | null) => (
    { type: 'VIDEO_CHAT__OPEN', payload: { room, remoteUserUid } } as const
  ),
  setViewEndCallAll: (viewEndCallAll: boolean) => (
    { type: 'VIDEO_CHAT__SET_VIEW_END_CALL_ALL', viewEndCallAll } as const
  ),
  setIsOwnerCall: () => (
    { type: 'VIDEO_CHAT__SET_IS_OWNER_CALL' } as const
  ),
  reset: () => ({ type: 'VIDEO_CHAT__RESET' } as const)
}
