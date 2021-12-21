import { onBackgroundMessage, getMessaging, isSupported } from 'firebase/messaging/sw'
import { initializeApp, FirebaseOptions } from 'firebase/app'
// @ts-ignore
import * as env from 'env'

const proj = env.REACT_APP_FIREBASE_PROJECT

const config = {
  apiKey: env.REACT_APP_FIREBASE_APIKEY,
  authDomain: `${proj}.firebaseapp.com`,
  databaseURL: `https://${proj}.firebaseio.com`,
  projectId: proj,
  storageBucket: `${proj}.appspot.com`,
  appId: env.REACT_APP_FIREBASE_APP_ID,
  measurementId: env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  messagingSenderId: env.REACT_APP_FIREBASE_APP_ID?.split(':')[1]
}

const app = initializeApp(config)

self.addEventListener('activate', (event) => {
  // @ts-ignore
  event.waitUntil(self.clients.claim())
})

isSupported()
  .then(() => {
    const messaging = getMessaging(app)

    onBackgroundMessage(messaging, ({ notification }) => {
      console.log('background message', notification)
      const { title, body, image } = notification ?? {}

      if (!title) {
        return
      }

      // @ts-ignore
      self.registration.showNotification(title, {
        body,
        icon: image
      })
    })
  })
  .catch((err) => {
    console.log(err)
  })
