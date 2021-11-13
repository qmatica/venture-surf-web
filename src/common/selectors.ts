import { createSelector } from 'reselect'
import { RootState } from './types'

const getInitializedSelector = (state: RootState) => state.app.initialized
const getIsFullScreenSelector = (state: RootState) => state.app.isFullScreen

export const getAppInitialized = createSelector(getInitializedSelector, (initialized) => initialized)
export const getIsFullScreen = createSelector(getIsFullScreenSelector, (isFullScreen) => isFullScreen)
