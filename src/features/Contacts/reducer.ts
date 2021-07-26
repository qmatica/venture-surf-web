import { ActionTypes } from './types'

const initialState = {
  search: ''
}

export const ContactsReducer = (state = initialState, action: ActionTypes): typeof initialState => {
  switch (action.type) {
    case 'CONTACTS__SET_SEARCH':
      return {
        ...state,
        search: action.search
      }
    default:
      return state
  }
}
