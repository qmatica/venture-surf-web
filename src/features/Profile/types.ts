import { ThunkAction } from 'redux-thunk'
import { AppStateType, InferActionsTypes } from 'common/types'
import { actions as actionsModal } from 'features/Modal/actions'
import { actions as actionsVideoChat } from 'features/VideoChat/actions'
import { actions as actionsConversations } from 'features/Conversations/actions'
import { actions as actionsNotifications } from 'features/Notifications/actions'
import { getFirebase } from 'react-redux-firebase'
import { UsersType, UserType } from 'features/User/types'
import { actions } from './actions'

export type ActionTypes = InferActionsTypes<typeof actions
                                          | typeof actionsModal
                                          | typeof actionsVideoChat
                                          | typeof actionsConversations
                                          | typeof actionsNotifications>
export type ThunkType = ThunkAction<Promise<void | boolean> | void, AppStateType, typeof getFirebase, ActionTypes>

export type ProfileType = {
    uid?: string
    first_name: string
    last_name: string
    displayName: string
    email: string
    phoneNumber: string
    zoomID: string
    photoURL: string
    activeRole: 'founder' | 'investor'
    tags: string[]
    liked: UsersType
    currentDeviceId: string
    isActiveFcm: boolean
    slots: SlotsType
    likes: UsersType
    mutuals: UsersType
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
        stages: number[]
        roles: string[]
        industries: string[]
        videos: {
            _order_: string[]
            _uploading_: string[]
        } & {
            [key: string]: VideoType
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
    company?: string
    title?: string
    headline?: string
    web?: string,
    email?: string
}

export type SlotsType = {
    [key: string]: {
        duration: number
        request: string
        status: string
        twilio: {
            made: {
                seconds: number
                nanoseconds: number
            }
            room: string
            token: string
        }
        uid: string
        disabled: []
        reccurent: string
    }
}

export type VideoType = {
    width: number
    height: number
    playbackID: string
    assetID: string
    created_at: number
}

export type onSnapshotVideoType = {
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

export type DeviceType = {
    id: string,
    os: string,
    fcm_token: string | void,
    voip_token: string,
    bundle: string
}

export type ResponseCallNowType = {
    pushes: {
        failed: { device: string }[]
        sent: { device: string }[]
    }
    room: string
    status: string
    token: string
}

export type ResultCompareContactsType = {
    contact: UserType,
    action: 'addUserInMyContacts' | 'removeUserInMyContacts'
}

export type ResultCompareInstanceCallType = {
    made: {
        seconds: number
        nanoseconds: number
    }
    token: string
    uid: string
    room: string
}

export type ContactsListType = 'mutuals' | 'likes' | 'liked'
