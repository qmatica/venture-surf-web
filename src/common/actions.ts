import { History } from 'history'
import { actions as authActions } from 'features/Auth/actions'
import { init as initProfile } from 'features/Profile/actions'
import { init as initSurf } from 'features/Surf/actions'
import { init as initConversations } from 'features/Conversations/actions'
import { init as initAdmin } from 'features/Admin/actions'
import { actions as contactsActions } from 'features/Contacts/actions'
import { lokalizeAPI } from 'api'
import { ThunkType } from './types'
import { checkRequestPublicProfile } from './utils'

export const actions = {
  setInitialized: (initialized: boolean) => ({ type: 'APP__SET_INITIALIZED', initialized } as const),
  setIsFullScreen: (isFullScreen: boolean) => ({ type: 'APP__SET_IS_FULL_SCREEN', isFullScreen } as const)
}

export const init = (history: History): ThunkType => async (dispatch, getState, getFirebase) => {
  // const result = await lokalizeAPI.getStrings()
  //
  // console.log(result)

  const paramsPublicProfile = checkRequestPublicProfile(history)

  if (paramsPublicProfile) {
    dispatch(contactsActions.setParamsPublicProfile(paramsPublicProfile))
  }

  getFirebase().auth().onAuthStateChanged(async (userAuth) => {
    dispatch(actions.setInitialized(true))
    if (userAuth) {
      await Promise.all([dispatch(initProfile()), dispatch(initSurf())])
      dispatch(authActions.setAuth(true))
      dispatch(initConversations())
      dispatch(initAdmin())
    } else {
      dispatch(authActions.setAuth(false))
    }
  })
}
