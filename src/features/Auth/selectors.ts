import { createSelector } from 'reselect'
import { RootState } from 'common/types'

const getMyUidSelector = (state: RootState) => state.firebase.auth.uid

export const getMyUid = createSelector(getMyUidSelector, (uid) => uid)

const getAuthSelector = (state: RootState) => state.auth.auth

export const getAuth = createSelector(getAuthSelector, (auth) => auth)
