import { createSelector } from 'reselect'
import moment from 'moment'
import { RootState } from 'common/types'
import { ChatType } from './types'

const getChatsSelector = (state: RootState) => state.inbox.chats
const getOpenedChatSelector = (state: RootState) => state.inbox.openedChat
const getPreloaderSelector = (state: RootState) => state.inbox.preloader

export const getChats = createSelector(getChatsSelector, (chats) => {
  const sortedChats: ChatType = {}

  Object.values(chats).sort((a, b) => {
    const lastMsgA = a.messages[a.messages.length - 1]
      ? moment(a.messages[a.messages.length - 1].date_updated).unix()
      : 0

    const lastMsgB = b.messages[b.messages.length - 1]
      ? moment(b.messages[b.messages.length - 1].date_updated).unix()
      : 0

    return lastMsgB - lastMsgA
  }).forEach((value) => {
    sortedChats[value.chat] = value
  })

  return sortedChats
})

export const getOpenedChat = createSelector(getOpenedChatSelector, (openedChat) => openedChat)

export const getPreloader = createSelector(getPreloaderSelector, (preloader) => preloader)
