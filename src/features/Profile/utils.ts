import { UsersType, UserType } from 'features/User/types'
import { SlotsType } from './types'

export const compareContacts = (prevContacts: UsersType, nextContacts: UsersType) => {
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

export const compareSlots = (prevSlots: SlotsType, nextSlots: SlotsType) => {
  if (nextSlots.now && nextSlots.now.status === 'proposed') {
    const { uid } = nextSlots.now
    const { room, token, made } = nextSlots.now.twilio

    return {
      made, room, token, uid
    }
  }

  if (nextSlots.now && nextSlots.now.status === 'free') {
    return 'declinedCall'
  }

  return null
}
