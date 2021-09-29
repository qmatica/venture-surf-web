import { createSelector } from 'reselect'
import moment from 'moment'
import { RootState } from 'common/types'
import { ChatType } from './types'

const getChatsSelector = (state: RootState) => state.inbox.chats

export const getChats = createSelector(getChatsSelector, (chats) => {
  const sortedChats: ChatType = {}
  Object.entries(chats).sort(([, a], [, b]) => {
    const lastMsgA = a.messages[a.messages.length - 1]
      ? moment(a.messages[a.messages.length - 1].date_updated).unix()
      : 0

    const lastMsgB = b.messages[b.messages.length - 1]
      ? moment(b.messages[b.messages.length - 1].date_updated).unix()
      : 0

    return lastMsgB - lastMsgA
  }).forEach(([key, value]) => {
    sortedChats[key] = value
  })

  return sortedChats
})
