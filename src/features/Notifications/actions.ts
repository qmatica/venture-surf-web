import { ThunkType } from './types'

export const actions = {
  addMessage: (message: string) => ({ type: 'NOTIFICATIONS__ADD_MESSAGE', message } as const),
  clearMessage: (message: string) => ({ type: 'NOTIFICATIONS__CLEAR_MESSAGE', message } as const)
}

export const addMessage = (message: string): ThunkType => async (dispatch, getState) => {
  setTimeout(() => {
    dispatch(actions.clearMessage(message))
  }, 15000)
  dispatch(actions.addMessage(message))
}
