import { onBackgroundMessage, getMessaging, isSupported } from 'firebase/messaging/sw'
import { initializeApp, FirebaseOptions } from 'firebase/app'

const proj = 'venturesurfdev'

const config = {
  apiKey: 'AIzaSyDZFzSz1QJ_ZsJ_6Ntc615pp-Ik1pe0wP8',
  authDomain: `${proj}.firebaseapp.com`,
  databaseURL: `https://${proj}.firebaseio.com`,
  projectId: proj,
  storageBucket: `${proj}.appspot.com`,
  appId: '1:1045764480750:web:2c8345a129babc71325dff',
  measurementId: 'G-P5PGTWBBFJ',
  messagingSenderId: '1045764480750'
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
