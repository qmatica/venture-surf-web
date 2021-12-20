import { onBackgroundMessage, getMessaging, isSupported } from 'firebase/messaging/sw'
import { initializeApp, FirebaseOptions } from 'firebase/app'

export const proj = process.env.REACT_APP_FIREBASE_PROJECT

export const config = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: `${proj}.firebaseapp.com`,
  databaseURL: `https://${proj}.firebaseio.com`,
  projectId: proj,
  storageBucket: `${proj}.appspot.com`,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  messagingSenderId: process.env.REACT_APP_FIREBASE_APP_ID?.split(':')[1]
}

// eslint-disable-next-line no-undef
declare let self: ServiceWorkerGlobalScope
const app = initializeApp(config)

self.addEventListener('activate', (event) => {
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

      self.registration.showNotification(title, {
        body,
        icon: image
      })
    })
  })
  .catch((err) => {
    console.log(err)
  })
