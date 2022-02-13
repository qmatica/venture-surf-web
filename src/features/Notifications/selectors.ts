import { RootState } from 'common/types'
import { createSelector } from 'reselect'

const notificationsHistorySelector = (state: RootState) => state.notifications.history

const isLoadedHistorySelector = (state: RootState) => state.notifications.history

export const getMyNotificationsHistory = createSelector(notificationsHistorySelector, (history) => history)

export const getIsLoadedHistory = createSelector(isLoadedHistorySelector, (isLoadedHistory) => isLoadedHistory)
