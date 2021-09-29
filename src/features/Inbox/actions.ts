import moment from 'moment'
import { config } from 'config/twilio'
import { actions as actionsNotifications } from 'features/Notifications/actions'
import { ChatType, MessageType, ThunkType } from './types'

export const actions = {
  setChats: (chats: ChatType) => (
    { type: 'INBOX__SET_CHATS', chats } as const
  ),
  setOpenedChat: (chat: string) => (
    { type: 'INBOX__SET_OPENED_CHAT', chat } as const
  ),
  addMessage: (message: MessageType, chat: string) => (
    { type: 'INBOX__ADD_MESSAGE', payload: { message, chat } } as const
  ),
  updateMessage: (message: MessageType, chat: string) => (
    { type: 'INBOX__UPDATE_MESSAGE', payload: { message, chat } } as const
  ),
  togglePreloader: () => (
    { type: 'INBOX__TOGGLE_PRELOADER' } as const
  ),
  reset: () => (
    { type: 'INBOX__RESET' } as const
  )
}

export const init = (): ThunkType => async (dispatch, getState) => {
  const { profile } = getState().profile

  dispatch(actions.togglePreloader())

  if (profile) {
    if (profile.mutuals) {
      const chats: ChatType = {}

      Object.values(profile.mutuals).forEach(({
        chat, name, displayName, first_name, last_name, photoURL
      }) => {
        if (chat?.chat) {
          chats[chat.chat] = {
            ...chats,
            chat: chat.chat,
            name: name || displayName || `${first_name} ${last_name}`,
            photoUrl: photoURL,
            messages: [],
            missedMessages: 0
          }
        }
      })

      const arrayRequestsOfChats = Object.keys(chats).map((chat) => getChats(chat))

      await Promise.all(arrayRequestsOfChats).then((response: any) => {
        Object.keys(chats).forEach((chat, i) => {
          chats[chat] = {
            ...chats[chat],
            messages: response[i].messages
          }
        })
      })

      dispatch(actions.setChats(chats))

      dispatch(actions.togglePreloader())
    }
  }
}

export const getChats = async (chat: string) =>
  fetch(`https://conversations.twilio.com/v1/Conversations/${chat}/Messages`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.accountSid}:${config.authToken}`).toString('base64')}`
    },
    method: 'GET'
  }).then((response: any) => response.json())

export const sendMessage = (message: string, chat: string): ThunkType => async (dispatch, getState) => {
  const { auth } = getState().firebase
  const { chats } = getState().inbox

  const newMessage: MessageType = {
    account_sid: '',
    attributes: '',
    author: auth.uid,
    body: message,
    conversation_sid: '',
    date_created: moment().toISOString(),
    date_updated: moment().toISOString(),
    delivery: null,
    index: chats[chat].messages.length,
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

  const body = {
    Body: message,
    Author: auth.uid
  }

  const formBody = Object.entries(body).map(([key, value]) => `${key}=${value}`).join('&')

  const updatedMessage = await fetch(`http://conversations.twilio.com/v1/Conversations/${chat}/Messages`, {
    headers: {
      'X-Twilio-Webhook-Enabled': 'true',
      Authorization: `Basic ${Buffer.from(`${config.accountSid}:${config.authToken}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formBody,
    method: 'POST'
  }).then((res) => res.json()).catch(() => {
    dispatch(actionsNotifications.addMessage({
      title: 'Error',
      value: 'Fucked CORS',
      type: 'error'
    }))
  })

  if (updatedMessage) {
    console.log(updatedMessage)
    dispatch(actions.updateMessage(updatedMessage, chat))
  }
}
