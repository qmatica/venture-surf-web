import { createSelector } from 'reselect'
import { RootState } from 'common/types'

const getIsAdminModeSelector = (state: RootState) => state.admin.isAdminMode

export const getIsAdminMode = createSelector(getIsAdminModeSelector, (isAdminMode) => isAdminMode)
