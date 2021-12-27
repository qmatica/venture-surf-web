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
    photoBase64: string
    stages?: number[]
    industries?: string[]
    tags?: string[]
    dt?: string
    job: { [key in 'founder' | 'investor']: Job } | Job
    content?: {
        docs?: DocsType,
        videos?: VideosType
    }
    activeRole: 'investor' | 'founder'
    recommended_by?: RecommendedUserType
    recommended_at?: Date
    message?: string
    reason?: string
    recommendedByList: RecommendedUserType[]
    chat?: string
    loading?: string[]
    clickedAction?: string
    slots: any
    fullLoaded?: boolean
    settings: {
        disable_instant_calls: boolean
        allow_founder_updates: boolean
        allow_zoom_calls: boolean
        allow_new_matches: boolean
    }
}

export type RecommendedUserType = {
    uid: string,
    job: {},
    photoURL: string,
    photoBase64: string
    roles: [
        'investor',
        'founder'
    ],
    dt: Date,
    displayName: string
    message?: string
}

export type Job = {
    company?: string
    title?: string
    headline?: string
    position?: string
}

export type UsersType = { [key: string]: UserType }
