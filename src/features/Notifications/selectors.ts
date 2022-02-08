import { RootState } from 'common/types'
import { createSelector } from 'reselect'

const getMyNotificationsHistorySelector = (state: RootState) => state.notifications.history

export const getMyNotificationsHistory = createSelector(getMyNotificationsHistorySelector, (history) => history)
