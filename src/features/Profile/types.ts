import { ThunkAction } from 'redux-thunk'
import { AppStateType, InferActionsTypes } from 'common/types'
import { actions as actionsModal } from 'features/Modal/actions'
import { getFirebase } from 'react-redux-firebase'
import { actions } from './actions'

export type ActionTypes = InferActionsTypes<typeof actions | typeof actionsModal>
export type ThunkType = ThunkAction<Promise<void | boolean>, AppStateType, typeof getFirebase, ActionTypes>

export type ProfileType = {
    first_name: string
    last_name: string
    displayName: string
    email: string
    phoneNumber: string
    zoomID: string
    photoURL: string
    activeRole: 'founder' | 'investor'
    stages: number[]
    roles: string[]
    industries: string[]
    tags: string[]
    liked: {}
    slots: {
        [key: string]: {
            status: string
            duration: number
            disabled: []
            reccurent: string
        }
    }
    likes: {
        [key: string]: {
            name: string
            photoURL: string
            displayName: string
            headline: string
            dt: string
            job_company: string
            uid: string
            job_title: string
        }
    }
    mutuals: MutualsType
    verified: {
        linkedIn: string
    }
    settings: {
        allow_new_matches: boolean
        allow_zoom_calls: boolean
        allow_founder_updates: boolean
        disable_instant_calls: boolean
    }
    devices: {
        [key: string]: {
            login_counter: number
            name: string
            os: string
            fcm_token: string
            id: string
            lastlogin_at: string
            install_counter: number
        }
    }
    videos: {
        [key: string] : VideoType
    }
} & {
    [key in 'founder' | 'investor']: {
        videos: {
            Technology: string
            _order_: string[]
            _uploading_: string[]
            Team: string
        }
        job: JobType
        docs: {
            _order_: string[]
        } & {
            [key: string]: string
        }
    }
} & {
    [key in 'investments' | 'investors']: {
        [key: string]: {
            status: string
        }
    }
}

export type JobType = {
    company: string
    title: string
    headline: string
}

export type VideoType = {
    aspect_ratio: string
    asset_id: string
    created: string
    duration_secs: number
    encoding_quality: string
    encoding_url: string
    id: string
    max_height: number
    max_width: number
    playbackID: string
    role: 'founder' | 'investor'
    status: 'uploading' | 'ready'
    thumb_url: string
    title: string
    uid: string
    upload_id: string
    upload_url: string
}

export type profileInteractionUsersType = {
    title: {
        founder: string,
        investor: string
    },
    content: {
        founder: 'investors',
        investor: 'investments'
    }
}

export type MutualsType = {
    [key: string]: MutualType
}

export type MutualType = {
    headline: string
    name: string
    displayName: string
    first_name: string
    last_name: string
    uid: string
    photoURL: string
    dt: string
    job: {
        company: string
        title: string
        headline: string
        position: string
    }
}
