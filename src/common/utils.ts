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

export function executeAllPromises(promises: Promise<any>[]) {
  const resolvingPromises = promises.map((promise: any) => new Promise((resolve) => {
    const payload = new Array(2)
    promise.then((result: any) => {
      payload[0] = result
    })
      .catch((error: any) => {
        payload[1] = error
      })
      .then(() => {
        resolve(payload)
      })
  }))

  const errors: any[] = []
  const results: any[] = []

  return Promise.all(resolvingPromises)
    .then((items: any) => {
      items.forEach((payload: any) => {
        if (payload[1]) {
          errors.push(payload[1])
        } else {
          results.push(payload[0])
        }
      })

      return {
        errors,
        results
      }
    })
}

export const setCharAt = (str: string, index: number, chr: string) => {
  if (index > str.length - 1) return str
  return str.substring(0, index) + chr + str.substring(index + chr.length)
}
