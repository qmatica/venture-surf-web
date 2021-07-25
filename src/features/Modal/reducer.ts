import { ActionTypes } from './types'

type modalType = {
  modalName: string,
  isLoading?: boolean
}

const initialState = {
  openModals: [] as modalType[]
}

export const ModalReducer = (state = initialState, action: ActionTypes): typeof initialState => {
  switch (action.type) {
    case 'MODAL__OPEN':
      return {
        ...state,
        openModals: [...state.openModals, { modalName: action.modalName }]
      }
    case 'MODAL__CLOSE':
      return {
        ...state,
        openModals: state.openModals.filter((modal) => modal.modalName !== action.modalName)
      }
    case 'MODAL__TOGGLE_LOADING': {
      const updatedModalIndex = state.openModals.findIndex((modal) => modal.modalName === action.payload.modalName)
      if (updatedModalIndex >= 0) {
        const updatedOpenModals = [...state.openModals]
        updatedOpenModals[updatedModalIndex] = {
          ...updatedOpenModals[updatedModalIndex],
          isLoading: action.payload.isLoading
        }
        return {
          ...state,
          openModals: updatedOpenModals
        }
      }
      return state
    }
    case 'MODAL__RESET':
      return initialState
    default:
      return state
  }
}
