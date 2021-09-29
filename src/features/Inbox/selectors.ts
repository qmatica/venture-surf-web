import { createSelector } from 'reselect'
import moment from 'moment'
import { RootState } from 'common/types'
import { DialogType } from './types'

const getDialogsSelector = (state: RootState) => state.inbox.dialogs

export const getDialogs = createSelector(getDialogsSelector, (dialogs) => {
  const sortedDialogs: DialogType = {}
  Object.entries(dialogs).sort(([, a], [, b]) => {
    const lastMsgA = a.messages[a.messages.length - 1]
      ? moment(a.messages[a.messages.length - 1].date_updated).unix()
      : 0

    const lastMsgB = b.messages[b.messages.length - 1]
      ? moment(b.messages[b.messages.length - 1].date_updated).unix()
      : 0

    return lastMsgB - lastMsgA
  }).forEach(([key, value]) => {
    sortedDialogs[key] = value
  })

  return sortedDialogs
})
