import { History } from 'history'

export const pipe = (...fns: ((value: any) => any)[]) =>
  (input: any) =>
    fns.reduce((chain, func) => chain.then(func), Promise.resolve(input))

export const deleteFieldsOfObject = (object: any, fields: string[]) => {
  const newObject = { ...object }

  fields.forEach((field) => {
    delete newObject[field]
  })

  return newObject
}

export const checkRequestPublicProfile = (history: History) => {
  const { pathname, search } = history.location
  const parts = pathname.split('/')
  if (parts[1] === 'profile' && parts[2]) {
    const uid = parts[2]
    if (search) {
      const [key, value] = search.replace('?', '').split('=')
      if (key === 'publicToken') {
        console.log('uid: ', uid)
        console.log('publicToken: ', value)
        return { uid, token: value }
      }
    }
  }
  return null
}
