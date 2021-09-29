import moment from 'moment'
import { config } from 'config/twilio'
import { DialogType, MessageType, ThunkType } from './types'

export const actions = {
  setDialogs: (dialogs: DialogType) => (
    { type: 'INBOX__SET_DIALOGS', dialogs } as const
  ),
  addMessage: (message: MessageType, chat: string) => (
    { type: 'INBOX__ADD_MESSAGE', payload: { message, chat } } as const
  ),
  updateMessage: (message: MessageType, chat: string) => (
    { type: 'INBOX__UPDATE_MESSAGE', payload: { message, chat } } as const
  )
}

export const init = (): ThunkType => async (dispatch, getState) => {
  const { profile } = getState().profile

  if (profile) {
    if (profile.mutuals) {
      const dialogs: DialogType = {}

      Object.values(profile.mutuals).forEach(({
        chat, name, displayName, first_name, last_name, photoURL
      }) => {
        if (chat) {
          dialogs[chat] = {
            ...dialogs,
            chat,
            name: name || displayName || `${first_name} ${last_name}`,
            photoUrl: photoURL,
            messages: [],
            missedMessages: 0
          }
        }
      })

      const arrayRequestsOfDialogs = Object.keys(dialogs).map((dialog) => getDialogs(dialog))

      await Promise.all(arrayRequestsOfDialogs).then((response: any) => {
        Object.keys(dialogs).forEach((chat, i) => {
          dialogs[chat] = {
            ...dialogs[chat],
            messages: response[i].messages
          }
        })
      })

      dispatch(actions.setDialogs(dialogs))
    }
  }
}

export const getDialogs = async (chat: string) =>
  fetch(`https://conversations.twilio.com/v1/Conversations/${chat}/Messages`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.accountSid}:${config.authToken}`).toString('base64')}`
    },
    method: 'GET'
  }).then((response: any) => response.json())

export const sendMessage = (message: string, chat: string): ThunkType => async (dispatch, getState) => {
  const { auth } = getState().firebase
  const { dialogs } = getState().inbox

  const newMessage: MessageType = {
    account_sid: '',
    attributes: '',
    author: auth.uid,
    body: message,
    conversation_sid: '',
    date_created: moment().toISOString(),
    date_updated: moment().toISOString(),
    delivery: null,
    index: dialogs[chat].messages.length,
    links: {
      delivery_receipts: ''
    },
    delivery_receipts: '',
    media: null,
    participant_sid: null,
    sid: (Math.random() + 1).toString(36).substring(7),
    url: '',
    notRead: true
  }

  dispatch(actions.addMessage(newMessage, chat))

  // const body = {
  //   Body: message,
  //   Author: auth.uid
  // }
  //
  // const formBody = Object.entries(body).map(([key, value]) => `${key}=${value}`).join('&')
  //
  // const updatedMessage = await fetch(`https://conversations.twilio.com/v1/Conversations/${chat}/Messages`, {
  //   headers: {
  //     Authorization: `Basic ${Buffer.from(`${config.accountSid}:${config.authToken}`).toString('base64')}`,
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   },
  //   body: formBody,
  //   method: 'POST'
  // }).then((res) => res.json())
  //
  // dispatch(actions.updateMessage(updatedMessage, chat))
}
