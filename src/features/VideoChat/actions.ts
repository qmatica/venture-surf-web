import {
  connect,
  ConnectOptions,
  Room
} from 'twilio-video'
import { actions as actionsNotifications } from 'features/Notifications/actions'
import { ThunkType } from './types'

export const actions = {
  setRoom: (room: Room | null) => (
    { type: 'VIDEO_CHAT__SET_ROOM', room } as const
  ),
  setViewEndCallAll: (viewEndCallAll: boolean) => (
    { type: 'VIDEO_CHAT__SET_VIEW_END_CALL_ALL', viewEndCallAll } as const
  ),
  setIsOwnerCall: () => (
    { type: 'VIDEO_CHAT__SET_IS_OWNER_CALL' } as const
  ),
  reset: () => ({ type: 'VIDEO_CHAT__RESET' } as const)
}

export const connectToVideoRoom = (room: string, token: string): ThunkType =>
  async (dispatch, getState) => {
    connect(token, { room, dominantSpeaker: true } as ConnectOptions)
      .then((room) => {
        dispatch(actions.setRoom(room))
      })
      .catch((err) => {
        dispatch(actionsNotifications.addErrorMsg(JSON.stringify(err)))
      })
  }
