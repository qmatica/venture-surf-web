import { UserType } from 'features/User/types'
import { Message } from '@twilio/conversations/lib/message'
import { profileAPI } from 'api'
import { ProfileType } from 'features/Profile/types'
import {
  IncomingCallType, NotificationsHistoryType, ThunkType, ValueNotificationsHistoryType
} from './types'

export const actions = {
  setHistory: (history: NotificationsHistoryType) => ({ type: 'NOTIFICATIONS__SET_HISTORY', history } as const),
  addItemInHistory: (id: string, value: ValueNotificationsHistoryType) => (
    { type: 'NOTIFICATIONS__ADD_ITEM_IN_HISTORY', payload: { id, value } } as const
  ),
  addLikeNotification: (value: any) => (
    { type: 'NOTIFICATIONS__ADD_LIKE', payload: value } as const
  ),
  setIsLoadedHistory: (isLoadedHistory: boolean) => (
    { type: 'NOTIFICATIONS__SET_IS_LOADED_HISTORY', isLoadedHistory } as const
  ),
  addAnyMsg: (message: { msg: string, uid: string }) => ({ type: 'NOTIFICATIONS__ADD_ANY_MESSAGE', message } as const),
  removeAnyMsg: (uid: string) => ({ type: 'NOTIFICATIONS__REMOVE_ANY_MESSAGE', uid } as const),
  addErrorMsg: (msg: string) => ({ type: 'NOTIFICATIONS__ADD_ERROR_MSG', msg } as const),
  removeErrorMsg: () => ({ type: 'NOTIFICATIONS__REMOVE_ERROR_MSG' } as const),
  addScheduledMeetMsg: (date: string, name: string, uid: string, uidMsg: string, secondsToMeet: number) => (
    {
      type: 'NOTIFICATIONS__ADD_SCHEDULED_MEET_MSG',
      payload: {
        date, name, uid, uidMsg, secondsToMeet
      }
    } as const
  ),
  removeScheduledMeetMsg: (uidMsg: string) => ({ type: 'NOTIFICATIONS__REMOVE_SCHEDULED_MEET_MSG', uidMsg } as const),
  addContactsEventMsg: (user: UserType, msg: string, uidMsg: string) => (
    { type: 'NOTIFICATIONS__ADD_CONTACTS_EVENT_MSG', payload: { user, msg, uidMsg } } as const
  ),
  removeContactsEventMsg: (uidMsg: string) => ({ type: 'NOTIFICATIONS__REMOVE_CONTACTS_EVENT_MSG', uidMsg } as const),
  addReceivedChatMsg: (user: UserType, msg: Message) => (
    { type: 'NOTIFICATIONS__ADD_RECEIVED_CHAT_MSG', payload: { user, msg } } as const
  ),
  removeReceivedChatMsg: (sid: string) => ({ type: 'NOTIFICATIONS__REMOVE_RECEIVED_CHAT_MSG', sid } as const),
  addIncomingCall: (payload: IncomingCallType) => ({ type: 'NOTIFICATIONS__ADD_INCOMING_CALL', payload } as const),
  removeIncomingCall: () => ({ type: 'NOTIFICATIONS__REMOVE_INCOMING_CALL' } as const)
}

export const readAllNotificationsCurrentRole = (): ThunkType => async (dispatch, getState) => {
  const updatedHistory = { ...getState().notifications.history }
  const { activeRole } = getState().profile.profile as ProfileType

  const notReadNotify = Object.entries(updatedHistory).reduce((prevIds: string[], [id, value]) => {
    if (value.status === 'active' && !value.data.role) return [...prevIds, id]
    if (value.status === 'active' && value.data.role === activeRole) return [...prevIds, id]
    return prevIds
  }, [])

  if (!notReadNotify.length) return

  notReadNotify.forEach((id) => {
    updatedHistory[id].status = 'read'
  })
  dispatch(actions.setHistory(updatedHistory))

  profileAPI.readNotifications(notReadNotify).then((res) => {
    console.log('readNotifications', res)
  }).catch((err) => {
    dispatch(actions.addErrorMsg(JSON.stringify(err)))
  })
}
