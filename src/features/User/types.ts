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
    job: { [key in 'founder' | 'investor']: Job } | Job
    content?: {
        docs?: DocsType,
        videos?: VideosType
    }
    activeRole: 'investor' | 'founder'
    recommended_by?: RecommendedUserType
    recommended_at?: Date
    recommended_message?: string
    reason?: string
    recommendedByList: RecommendedUserType[]
    chat?: string
    loading?: string[]
    clickedAction?: string
    slots: any
    fullLoaded?: boolean
}

export type RecommendedUserType = {
    uid: string,
    job: {},
    photoURL: string,
    roles: [
        'investor',
        'founder'
    ],
    dt: Date,
    displayName: string
    recommended_message?: string
}

export type Job = {
    company?: string
    title?: string
    headline?: string
    position?: string
}

export type UsersType = { [key: string]: UserType }
