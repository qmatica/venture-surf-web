import { createSelector } from 'reselect'
import moment from 'moment'
import { RootState } from 'common/types'
import { ChatType } from './types'

const getChatsSelector = (state: RootState) => state.conversations.chats
const getOpenedChatSelector = (state: RootState) => state.conversations.openedChat

export const getChats = createSelector(getChatsSelector, (chats) => {
  const sortedChats: ChatType = {}

  Object.values(chats).sort((a, b) => {
    const lastMsgA = a.messages && a.messages[a.messages.length - 1]
      ? moment(a.messages[a.messages.length - 1].dateUpdated).unix()
      : 0

    const lastMsgB = b.messages && b.messages[b.messages.length - 1]
      ? moment(b.messages[b.messages.length - 1].dateUpdated).unix()
      : 0

    return lastMsgB - lastMsgA
  }).forEach((value) => {
    sortedChats[value.chat] = value
  })

  return sortedChats
})

export const getOpenedChat = createSelector(getOpenedChatSelector, (openedChat) => openedChat)
