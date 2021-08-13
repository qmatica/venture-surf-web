import { DocsType, VideosType } from 'common/types'

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
    actions?: { [key: string]: () => void }
    activeActions?: string[]
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

export type ActionsUserType = {
    like?: () => void
    withdrawLike?: () => void
}
