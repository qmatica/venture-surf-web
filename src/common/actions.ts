import { History } from 'history'
import { actions as authActions } from 'features/Auth/actions'
import { init as initProfile } from 'features/Profile/actions'
import { init as initSurf } from 'features/Surf/actions'
import { init as initConversations } from 'features/Conversations/actions'
import { init as initAdmin } from 'features/Admin/actions'
import { actions as contactsActions } from 'features/Contacts/actions'
import { actions as actionsNotifications } from 'features/Notifications/actions'
import { lokalizeAPI, usersAPI } from 'api'
import { v4 as uuidv4 } from 'uuid'
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

  getFirebase().auth().onAuthStateChanged(async (userAuth: any) => {
    dispatch(actions.setInitialized(true))
    if (
      // TODO: This change sometimes logs the user out on reload
      // but is necessary to avoid unused calls on registration. Need to investigate
      //  (getState().profile.isRegistration === null &&
      //  userAuth?.metadata?.creationTime !==
      //    userAuth?.metadata?.lastSignInTime) &&
      // (!getState().profile.isRegistration &&
      userAuth
    ) {
      await Promise.all([dispatch(initProfile()), dispatch(initSurf())])
      dispatch(authActions.setAuth(true))
      dispatch(initConversations())
      dispatch(initAdmin())
    } else {
      dispatch(authActions.setAuth(false))
    }
  })
}

export const addToClipboardPublicLinkProfile = (
  uid: string,
  togglePreloader: () => void
): ThunkType => async (dispatch) => {
  const createPublicLink = (uid: string, token: string) => {
    const baseURL = window.location.origin
    return `${baseURL}/profile/${uid}?publicToken=${token}`
  }

  // @ts-ignore
  // eslint-disable-next-line no-undef
  // eslint-disable-next-line
  const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === '[object SafariRemoteNotification]' }(!window.safari || (typeof safari !== 'undefined' && safari.pushNotification)))

  if (isSafari) {
    // @ts-ignore
    // eslint-disable-next-line no-undef
    const clipboardItem = new ClipboardItem({
      'text/plain': usersAPI.createPublicToken(uid).then(({ token }) => {
        const publicLinkProfile = createPublicLink(uid, token)

        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve) => {
          if (clipboardItem) {
            resolve(new Blob([publicLinkProfile]))
            dispatch(actionsNotifications.addAnyMsg({
              msg: 'Public link for profile copied!',
              uid: uuidv4()
            }))
            togglePreloader()
          }
        })
      }).catch((err) => {
        dispatch(actionsNotifications.addErrorMsg(JSON.stringify(err)))
        togglePreloader()
      })
    })
    // @ts-ignore
    navigator.clipboard.write([clipboardItem])
    return
  }

  usersAPI.createPublicToken(uid).then(({ token }) => {
    const publicLinkProfile = createPublicLink(uid, token)

    navigator.clipboard.writeText(publicLinkProfile).then(() => {
      dispatch(actionsNotifications.addAnyMsg({
        msg: 'Public link for profile copied!',
        uid: uuidv4()
      }))
      togglePreloader()
    })
  }).catch((err) => {
    dispatch(actionsNotifications.addErrorMsg(JSON.stringify(err)))
    togglePreloader()
  })
}
