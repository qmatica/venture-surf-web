import { DocsType, VideosType } from 'common/types'
import { ReactElement } from 'react'
import { EnumActionsUser } from './constants'

export type UserType = {
    name?: string
    displayName?: string
    first_name: string
    last_name: string
    uid: string
    photoURL: string
    stages?: number[]
    industries?: string[]
    tags?: string[]
    dt?: string
    actions: ActionUserType
    job?: {
        company?: string
        title?: string
        headline?: string
        position?: string
    }
    content?: {
        docs?: DocsType,
        videos?: VideosType
    }
    activeRole?: 'investor' | 'founder'
}

export type UsersType = { [key: string]: UserType }

export type ActionUserType = {
    [key: string]: {
        onClick: () => void
        title: string
        isActive: boolean
        isLoading: boolean
        type: EnumActionsUser
        icon?: () => ReactElement<any, any>
    }
}
