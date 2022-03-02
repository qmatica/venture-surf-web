import { usersAPI } from 'api'
import { apiCodes } from 'common/types'
import { UserType } from 'features/User/types'
import { actions as profileActions } from 'features/Profile/actions'
import { actions as notificationsActions } from 'features/Notifications/actions'
import { v4 as uuidv4 } from 'uuid'
import { formatRecommendedUsers } from 'common/utils'
import { ProfileType } from 'features/Profile/types'
import { actions as contactsActions } from 'features/Contacts/actions'
import { profileInteractionUsers } from 'features/Profile/constants'
import { ThunkType } from './types'

export const actions = {
  setRecommendedUsers: (recommendedUsers: UserType[]) => (
    { type: 'SURF__SET_RECOMMENDED_USERS', recommendedUsers } as const
  ),
  updateRecommendedUser: (recommendedUser: UserType) => (
    { type: 'SURF__UPDATE_RECOMMENDED_USER', recommendedUser } as const
  ),
  setUsers: (users: UserType[]) => ({ type: 'SURF__SET_USERS', users } as const),
  addUser: (user: UserType) => ({ type: 'SURF__ADD_USER', user } as const),
  removeUser: (user: UserType) => ({ type: 'SURF__REMOVE_USER', user } as const)
}

export const init = (): ThunkType => async (dispatch, getState) => {
  const { getMatches, getRecommended } = usersAPI

  const response = await Promise.all([getRecommended(), getMatches()]).catch((err) => {
    /*dispatch(addMessage({
      title: 'Error loading surf users',
      value: err.error,
      type: 'error'
    }))*/
    console.log(err.error)
  })

  if (!response) return

  const recommendedUsers: { [key: string]: UserType[] } = response[0]

  const formattedRecommendedUsers = formatRecommendedUsers(recommendedUsers)

  dispatch(actions.setRecommendedUsers(Object.values(formattedRecommendedUsers)))

  const users: UserType[] = response[1].matches.filter((user: UserType) => !formattedRecommendedUsers[user.uid])

  dispatch(actions.setUsers(users))
}

export const like = (
  uid: string,
  isRecommended: boolean,
  action: 'like' | 'withdrawLike'
): ThunkType => async (dispatch, getState) => {
  const usersList = isRecommended ? 'recommendedUsers' : 'users'
  const actionType = isRecommended ? 'setRecommendedUsers' : 'setUsers'

  const users = getState().surf[usersList]

  if (users) {
    const updatedUsers = [...users]
    const updatedUserIndex = users.findIndex((user) => user.uid === uid)

    if (updatedUserIndex >= 0) {
      updatedUsers[updatedUserIndex] = {
        ...updatedUsers[updatedUserIndex],
        loading: [action],
        clickedAction: `surf-${action}`
      }
      dispatch(actions[actionType](updatedUsers))

      const status = await usersAPI[action](uid).catch((err) => {
        dispatch(notificationsActions.addErrorMsg(JSON.stringify(err)))
      })

      if (status === apiCodes.success) {
        const users = getState().surf[usersList]
        const updatedUsers = [...users]

        updatedUsers[updatedUserIndex] = {
          ...updatedUsers[updatedUserIndex],
          loading: []
        }
        dispatch(actions[actionType](updatedUsers))

        const profileAction = action === 'like' ? 'addUserInMyContacts' : 'removeUserInMyContacts'

        dispatch(profileActions[profileAction](updatedUsers[updatedUserIndex], 'likes'))
      }
    }
  }
}

export const acceptInvest = (uid: string): ThunkType => async (dispatch) => {
  dispatch(profileActions.toggleLoader(`${uid}-acceptInvest`))
  const result = await usersAPI.addInvest(uid, []).catch((err) => {
    dispatch(notificationsActions.addAnyMsg({ msg: JSON.stringify(err), uid: uuidv4() }))
  })
  if (result) {
    dispatch(profileActions.acceptInvest(uid))
    dispatch(profileActions.toggleLoader(`${uid}-acceptInvest`))
  }
}

export const addInvest = (
  uid: string, investorList: string[], activeRole: 'investors' | 'investments', setIsOpenModal: (isOpenModal: boolean) => void
): ThunkType => async (dispatch) => {
  dispatch(profileActions.toggleLoader('requestToInvest'))
  const result = await usersAPI.addInvest(uid, investorList).catch((err) => {
    dispatch(notificationsActions.addAnyMsg({ msg: JSON.stringify(err), uid: uuidv4() }))
  })
  if (result) {
    dispatch(profileActions.addInvests(result[activeRole]))
    dispatch(notificationsActions.addAnyMsg({
      msg: 'Your request has been sent',
      uid: uuidv4()
    }))
  }
  dispatch(profileActions.toggleLoader('requestToInvest'))
  setIsOpenModal(false)
}

export const addYourself = (uid: string, selectedRole: 'investors' | 'investments', profile?: ProfileType): ThunkType => async (dispatch, getState) => {
  const { profile: myProfile } = getState().profile
  const result = await usersAPI.addInvest(uid, []).catch((err) => {
    dispatch(notificationsActions.addAnyMsg({ msg: JSON.stringify(err), uid: uuidv4() }))
  })
  if (result) {
    dispatch(profileActions.addYourself(uid, selectedRole))
    if (profile) {
      dispatch(contactsActions.setOtherProfile({
        ...profile,
        [selectedRole]: { ...profile[selectedRole], [myProfile?.uid as string]: { status: 'requested' } }
      }))
    }
    dispatch(profileActions.addInvests(result[profileInteractionUsers.content[myProfile?.activeRole as 'investor' | 'founder']]))
    dispatch(notificationsActions.addAnyMsg({
      msg: 'Your request has been sent',
      uid: uuidv4()
    }))
  }
}

export const deleteInvest = (uid: string): ThunkType => async (dispatch, getState) => {
  const { profile } = getState().profile
  dispatch(profileActions.toggleLoader(`${uid}-deleteInvest`))
  const result = await usersAPI.deleteInvest(uid).catch((err) => {
    dispatch(notificationsActions.addAnyMsg({ msg: JSON.stringify(err), uid: uuidv4() }))
  })
  if (result) {
    dispatch(profileActions.deleteInvest(uid))
    const msg = profile?.activeRole === 'founder' ? 'Investor has been removed from list!' : 'Investment request has been removed from list!'
    dispatch(notificationsActions.addAnyMsg({
      msg,
      uid: uuidv4()
    }))
  }
  dispatch(profileActions.toggleLoader(`${uid}-deleteInvest`))
}
