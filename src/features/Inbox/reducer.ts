import { ActionTypes, DialogType } from './types'

const initialState = {
  dialogs: {} as DialogType,
  preloader: false
}

export const InboxReducer = (state = initialState, action: ActionTypes): typeof initialState => {
  switch (action.type) {
    case 'INBOX__SET_DIALOGS':
      return {
        ...state,
        dialogs: action.dialogs
      }
    case 'INBOX__ADD_MESSAGE':
      return {
        ...state,
        dialogs: {
          ...state.dialogs,
          [action.payload.chat]: {
            ...state.dialogs[action.payload.chat],
            messages: [
              ...state.dialogs[action.payload.chat].messages,
              action.payload.message
            ]
          }
        }
      }
    case 'INBOX__UPDATE_MESSAGE': {
      const updatedDialogMessages = [...state.dialogs[action.payload.chat].messages]

      updatedDialogMessages[action.payload.message.index] = action.payload.message

      return {
        ...state,
        dialogs: {
          ...state.dialogs,
          [action.payload.chat]: {
            ...state.dialogs[action.payload.chat],
            messages: updatedDialogMessages
          }
        }
      }
    }
    default: return state
  }
}
