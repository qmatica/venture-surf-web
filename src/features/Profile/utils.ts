import { UsersType, UserType } from 'features/User/types'
import { isSupported, getToken, getMessaging } from 'firebase/messaging'
import { firebaseApp } from 'store/store'
import { SlotsType } from './types'

export const compareCountContacts = (prevContacts: UsersType, nextContacts: UsersType) => {
  let contact = null

  Object.keys(nextContacts).some((key) => {
    if (!prevContacts[key]) {
      contact = prepareContact(nextContacts[key], key)
      return true
    }
    return false
  })

  if (contact) {
    return { contact, action: 'addUserInMyContacts' } as const
  }

  Object.keys(prevContacts).some((key) => {
    if (!nextContacts[key]) {
      contact = prepareContact(prevContacts[key], key)
      return true
    }
    return false
  })

  if (contact) {
    return { contact, action: 'removeUserInMyContacts' } as const
  }

  return contact
}

const prepareContact = (contact: UserType, key: string) => ({
  ...contact,
  uid: key
})

export const compareNowSlot = (
  prevSlots: SlotsType,
  nextSlots: SlotsType,
  isOwnerCall: boolean,
  updateSlots: (action: 'add' | 'del' | 'disable' | 'enable', slot: string | SlotsType) => void
) => {
  console.log('nextSlots', nextSlots)
  if (prevSlots?.now !== nextSlots?.now) {
    updateSlots('add', { now: nextSlots.now })
  }

  if (nextSlots?.now && nextSlots.now.status === 'free') {
    updateSlots('del', 'now')
    return 'declinedCall'
  }

  if (isOwnerCall) return null

  if (nextSlots?.now) {
    if (prevSlots?.now?.uid !== nextSlots?.now.uid) {
      const { uid } = nextSlots.now
      if (nextSlots.now.twilio) {
        const { room, token, made } = nextSlots.now.twilio

        return {
          made, room, token, uid
        }
      }
    }
  }

  return null
}

export const getTokenFcm = async () => {
  const supported = await isSupported().catch(() => false)
  if (!supported) {
    console.log('Browser not supported SW!')
    return null
  }

  const sw = await window.navigator.serviceWorker.register('/sw.js')

  const messaging = getMessaging(firebaseApp)

  const token = await getToken(messaging, {
    serviceWorkerRegistration: sw
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err)
  })

  return token
}
