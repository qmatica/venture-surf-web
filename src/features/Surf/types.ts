import { ThunkAction } from 'redux-thunk'
import { getFirebase } from 'react-redux-firebase'
import { actions } from './actions'
import { AppStateType, InferActionsTypes } from '../../common/types'

export type ActionTypes = InferActionsTypes<typeof actions>
export type ThunkType = ThunkAction<Promise<void | boolean>, AppStateType, typeof getFirebase, ActionTypes>

export type surfUser = {
    uid: string,
    photoURL: string,
    first_name: string,
    last_name: string,
    displayName: string,
    stages: number[],
    industries: string[],
    tags: string[],
    job: {
        headline: string,
        company: string,
        title: string
    },
    content: {
        docs: {
            _order_: string[]
        } & {
            [key: string]: string
        },
        videos: {
            _order_: string[],
            _uploading_: string[]
        } & {
            [key: string]: string
        }
    },
    activeRole: 'investor' | 'founder'
}
