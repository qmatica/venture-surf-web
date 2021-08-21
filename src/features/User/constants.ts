import {
  CalendarMinIcon, LikeIcon, PeopleIcon, PhoneCallIcon, WithdrawLikeIcon
} from 'common/icons'

export const actionsUser = {
  like: {
    title: 'Like',
    action: 'like',
    icon: LikeIcon
  },
  withdrawLike: {
    title: 'Withdraw like',
    action: 'withdrawLike',
    icon: WithdrawLikeIcon
  },
  callNow: {
    title: 'Call now',
    action: 'callNow',
    icon: PhoneCallIcon
  },
  arrangeAMeeting: {
    title: 'Arrange a meeting',
    action: 'arrangeAMeeting',
    icon: CalendarMinIcon
  },
  recommended: {
    title: 'Recommended',
    action: 'recommended',
    icon: PeopleIcon
  },
  accept: {
    title: 'Accept',
    action: 'accept'
  },
  ignore: {
    title: 'Ignore',
    action: 'ignore'
  }
}

export enum EnumActionsUser {
  dynamic,
  static
}
