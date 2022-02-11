import { RefObject, useEffect, useRef } from 'react'

export const usePrevious = (value: any) => {
  const ref: any = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export const useOutside = (ref: RefObject<HTMLInputElement>, action: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        action()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, action])
}
