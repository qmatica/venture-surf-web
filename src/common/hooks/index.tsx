import { useEffect, useRef } from 'react'

export const usePrevious = (value: any) => {
  const ref: any = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
