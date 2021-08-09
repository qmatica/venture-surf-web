import { MessageType, ThunkType } from './types'

export const actions = {
  addMessage: (message: MessageType) => ({ type: 'NOTIFICATIONS__ADD_MESSAGE', message } as const),
  clearMessage: (message: MessageType) => ({ type: 'NOTIFICATIONS__CLEAR_MESSAGE', message } as const)
}

export const addMessage = (message: MessageType): ThunkType => async (dispatch, getState) => {
  setTimeout(() => {
    dispatch(actions.clearMessage(message))
  }, 150000)
  dispatch(actions.addMessage(message))
}
