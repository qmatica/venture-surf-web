import { createSelector } from 'reselect'
import { RootState } from './types'

const getAppInitializedSelector = (state: RootState) => state.app.initialized

export const getAppInitialized = createSelector(getAppInitializedSelector, (initialized) => initialized)
