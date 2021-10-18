import { initializeApp } from 'firebase/app'
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'

const proj = process.env.REACT_APP_FIREBASE_PROJECT

const firebaseApp = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: `${proj}.firebaseapp.com`,
  databaseURL: `https://${proj}.firebaseio.com`,
  projectId: proj,
  storageBucket: `${proj}.appspot.com`,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  messagingSenderId: process.env.REACT_APP_FIREBASE_APP_ID?.split(':')[1]
})

const messaging = getMessaging(firebaseApp)

onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)
  // Customize notification here
  const notificationTitle = 'Background Message Title'
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
