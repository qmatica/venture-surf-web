import { DocsType, VideosType } from 'common/types'
import { ReactElement } from 'react'

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
    bodyActions?: { [key: string]: () => void }
    actions?: { [key: string]: () => void }
    activeActions?: ActiveActionsUserType[]
    loaders: string[]
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

export type ActiveActionsUserType = {
    title: string,
    action: string,
    icon: () => ReactElement
}
