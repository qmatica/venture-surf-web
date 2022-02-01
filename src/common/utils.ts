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

export const getImageSrcFromBase64 = (base64: string, photoUrl: string) =>
  (base64 ? `data:image/*;base64,${base64}` : photoUrl)

export async function downloadFile(fileUrl: string, title: string) {
  // TODO: Fetch gets CORS error. Need to configure from BE
  const response = await fetch(fileUrl, {
    method: 'GET'
  })
  if (!response.ok) {
    throw response
  }
  const data = await response.blob()

  const url = window.URL.createObjectURL(new Blob([data], { type: data.type }))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', title)
  document.body.appendChild(link)
  link.click()
  link.parentNode?.removeChild(link)
}

export const formatSeconds = (mins: string | number): string => {
  const minutes = Number(mins)
  if (Math.floor(minutes / 60)) return `${Math.floor(minutes / 3600)} hours`
  return `${minutes} minutes`
}

export const isNumber = (n: string) => /^-?[\d.]+(?:e-?\d+)?$/.test(n)
