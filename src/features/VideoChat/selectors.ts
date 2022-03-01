import { RootState } from 'common/types'
import { createSelector } from 'reselect'

const videoChatSelector = (state: RootState) => state.videoChat

export const getVideoChat = createSelector(videoChatSelector, (videoChat) => videoChat)
