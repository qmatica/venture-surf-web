import { Client as ConversationsClient } from '@twilio/conversations'
import { Message } from '@twilio/conversations/lib/message'
import { config } from 'config/twilio'
import { profileAPI } from 'api'
import { ChatType, MessageType, ThunkType } from './types'

export const actions = {
  setClient: (client: ConversationsClient) => (
    { type: 'CONVERSATIONS__SET_CONVERSATIONS_CLIENT', client } as const
  ),
  setChats: (chats: ChatType) => (
    { type: 'CONVERSATIONS__SET_CHATS', chats } as const
  ),
  setOpenedChat: (chat: string) => (
    { type: 'CONVERSATIONS__SET_OPENED_CHAT', chat } as const
  ),
  addMessage: (message: Message | MessageType, chat: string) => (
    { type: 'CONVERSATIONS__ADD_MESSAGE', payload: { message, chat } } as const
  ),
  updateMessage: (message: Message | MessageType, chat: string) => (
    { type: 'CONVERSATIONS__UPDATE_MESSAGE', payload: { message, chat } } as const
  ),
  togglePreloader: () => (
    { type: 'CONVERSATIONS__TOGGLE_PRELOADER' } as const
  ),
  reset: () => (
    { type: 'CONVERSATIONS__RESET' } as const
  )
}

export const init = (): ThunkType => async (dispatch, getState) => {
  const { profile } = getState().profile

  if (profile) {
    if (profile.mutuals) {
      const chats: ChatType = {}

      Object.values(profile.mutuals).forEach(({
        chat, name, displayName, first_name, last_name, photoURL
      }) => {
        if (chat) {
          chats[chat] = {
            ...chats,
            chat,
            name: name || displayName || `${first_name} ${last_name}`,
            photoUrl: photoURL,
            messages: [],
            missedMessages: 0
          }
        }
      })

      dispatch(actions.setChats(chats))

      dispatch(initConversations(chats))
    }
  }
}

export const initConversations = (chats: ChatType): ThunkType => async (dispatch, getState) => {
  const { auth: { uid } } = getState().firebase

  const conversationsToken = await profileAPI.getToken()
  const client = await ConversationsClient.create(conversationsToken.token)

  dispatch(actions.setClient(client))

  client.on('connectionStateChanged', (state) => {
    if (state === 'connecting') {
      console.log('Connecting to Twilio…')
    }
    if (state === 'connected') {
      console.log('You are connected.')
    }
    if (state === 'disconnecting') {
      console.log('Disconnecting from Twilio…')
    }
    if (state === 'disconnected') {
      console.log('Disconnected.')
    }
    if (state === 'denied') {
      console.log('Failed to connect.')
    }
  })

  client.on('conversationJoined', (conversation) => {
    console.log(conversation)
  })
  client.on('conversationLeft', (thisConversation) => {
    console.log(thisConversation)
  })

  const subscribedConversations = await client.getSubscribedConversations()

  if (subscribedConversations.items.length) {
    const chatsWithConversation: ChatType = {}

    subscribedConversations.items.forEach((item) => {
      chatsWithConversation[item.sid] = {
        ...chats[item.sid],
        conversation: item
      }
    })

    dispatch(actions.setChats(chatsWithConversation))

    Object.values(chatsWithConversation).forEach((chat) => {
      chat.conversation?.on('messageAdded', (m: Message) => {
        if (m.author === uid) {
          dispatch(actions.updateMessage(m, chat.chat))
        } else {
          dispatch(actions.addMessage(m, chat.chat))
        }
      })
    })

    const getAllMessages = () => Object.values(chatsWithConversation).map((chat) => chat.conversation?.getMessages())

    const allMessages = await Promise.all(getAllMessages())

    if (allMessages.length) {
      const chatsWithMessages: ChatType = {}

      Object.values(chatsWithConversation).forEach((chat, index) => {
        chatsWithMessages[chat.chat] = {
          ...chat,
          messages: allMessages[index]?.items || []
        }
      })

      dispatch(actions.setChats(chatsWithMessages))
    }
  }

  // subscribedConversations.items[0].on('messageAdded', (m) => {
  //   console.log(m)
  // })

  // const chat = await client.getConversationBySid('CHd959cc020b7d4e27b3a7a00e6b312388')
  //
  // const sendedMessage = await chat.sendMessage('1234')
}

export const getMessages = async (chat: string) =>
  fetch(`https://conversations.twilio.com/v1/Conversations/${chat}/Messages`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.accountSid}:${config.authToken}`).toString('base64')}`
    },
    method: 'GET'
  }).then((response: any) => response.json())

export const sendMessage = (message: string, chat: string): ThunkType => async (dispatch, getState) => {
  const { auth } = getState().firebase
  const { chats } = getState().conversations

  const newMessage: Message | MessageType = {
    author: auth.uid,
    body: message,
    dateCreated: new Date(),
    dateUpdated: new Date(),
    index: chats[chat].messages.length,
    sid: (Math.random() + 1).toString(36).substring(7),
    aggregatedDeliveryReceipt: null
  }

  dispatch(actions.addMessage(newMessage, chat))

  const res = await chats[chat].conversation?.sendMessage(message)

  console.log(res)

  // const body = {
  //   Body: message,
  //   Author: auth.uid
  // }
  //
  // const formBody = Object.entries(body).map(([key, value]) => `${key}=${value}`).join('&')
  //
  // const updatedMessage = await fetch(`http://conversations.twilio.com/v1/Conversations/${chat}/Messages`, {
  //   headers: {
  //     'X-Twilio-Webhook-Enabled': 'true',
  //     Authorization: `Basic ${Buffer.from(`${config.accountSid}:${config.authToken}`).toString('base64')}`,
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   },
  //   body: formBody,
  //   method: 'POST'
  // }).then((res) => res.json()).catch(() => {
  //   dispatch(actionsNotifications.addMessage({
  //     title: 'Error',
  //     value: 'Fucked CORS',
  //     type: 'error'
  //   }))
  // })
  //
  // if (updatedMessage) {
  //   console.log(updatedMessage)
  //   dispatch(actions.updateMessage(updatedMessage, chat))
  // }
}
