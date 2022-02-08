import { ReactElement } from 'react'

export type PageType = {
  url?: string,
  title: string,
  icon: ReactElement
}

export type DropDownItemType = {
  title: string
  url?: string
  onClick?: () => void
  icon: ReactElement
  isLoading?: boolean
}
