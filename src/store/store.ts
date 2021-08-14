import firebase from 'firebase/app'
import { getFirebase, firebaseReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore'
import 'firebase/auth'
import 'firebase/firestore'
import {
  applyMiddleware, combineReducers, compose, createStore
} from 'redux'
import thunk from 'redux-thunk'
import { AppReducer } from 'common/reducer'
import { AuthReducer } from 'features/Auth/reducer'
import { ProfileReducer } from 'features/Profile/reducer'
import { ModalReducer } from 'features/Modal/reducer'
import { ContactsReducer } from 'features/Contacts/reducer'
import { SurfReducer } from 'features/Surf/reducer'
import { NotificationsReducer } from 'features/Notifications/reducer'
import { VideoChatReducer } from 'features/VideoChat/reducer'
import { config } from 'config/firebase'

firebase.initializeApp(config)
firebase.firestore()

export const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  app: AppReducer,
  auth: AuthReducer,
  profile: ProfileReducer,
  contacts: ContactsReducer,
  modal: ModalReducer,
  surf: SurfReducer,
  notifications: NotificationsReducer,
  videoChat: VideoChatReducer
})

const middlewares = [
  thunk.withExtraArgument(getFirebase)
]

const composeEnhancers = (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares)))
