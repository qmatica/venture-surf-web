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

export const rrfConfig = {
  useFirestoreForProfile: true
}
