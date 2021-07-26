import { actions as authActions } from 'features/Auth/actions'
import { init as initProfile } from 'features/Profile/actions'
import { init as initSurf } from 'features/Surf/actions'
import { ThunkType } from './types'

export const actions = {
  setInitialized: (initialized: boolean) => ({ type: 'APP__SET_INITIALIZED', initialized } as const)
}

export const init = (): ThunkType => async (dispatch, getState, getFirebase) => {
  getFirebase().auth().onAuthStateChanged(async (userAuth) => {
    dispatch(actions.setInitialized(true))
    if (userAuth) {
      dispatch(authActions.setAuth(true))
      await Promise.all([dispatch(initProfile()), dispatch(initSurf())])
    }
  })
}
