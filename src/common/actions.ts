import { History } from 'history'
import { actions as authActions } from 'features/Auth/actions'
import { init as initProfile } from 'features/Profile/actions'
import { init as initSurf } from 'features/Surf/actions'
import { init as initConversations } from 'features/Conversations/actions'
import { getPublicProfile } from 'features/Contacts/actions'
import { ThunkType } from './types'
import { checkRequestPublicProfile } from './utils'

export const actions = {
  setInitialized: (initialized: boolean) => ({ type: 'APP__SET_INITIALIZED', initialized } as const)
}

export const init = (history: History): ThunkType => async (dispatch, getState, getFirebase) => {
  getFirebase().auth().onAuthStateChanged(async (userAuth) => {
    dispatch(actions.setInitialized(true))
    if (userAuth) {
      await Promise.all([dispatch(initProfile()), dispatch(initSurf())])
      dispatch(authActions.setAuth(true))
      dispatch(initConversations())
    } else {
      const result = checkRequestPublicProfile(history)

      if (result) {
        const { uid, token } = result
        dispatch(getPublicProfile(uid, token))
      }

      dispatch(authActions.setAuth(false))
    }
  })
}
