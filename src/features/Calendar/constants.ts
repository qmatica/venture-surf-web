import { SlotType } from 'features/Calendar/types'

export const CHOOSE_SLOTS_MODAL = {
  CANCEL: 'Cancel',
  SUBMIT: 'Submit',
  REPEAT_WEEKLY: 'Repeat weekly',
  REPEAT_DAILY: 'Repeat daily',
  CUSTOM: 'Custom',
  ONLY_CURRENT_DATE: 'Only the current date',
  DAYS: 'Select days',
  WEEK: 'Repeat for the next',
  END_REPEAT_ON: 'End repeat on',
  BACK: 'Back'
}

export const SLOTS_REPEAT: { [key: string]: SlotType } = {
  CURRENT_DATE: 'Z',
  WEEKLY: 'W',
  DAILY: 'D',
  CUSTOM: 'custom',
  // TODO: Better values
  ONE: '0',
  ALL: 'ALL'
}

export const CHOOSE_SLOTS_MODAL_VALUES: { value: SlotType, description: string }[] = [
  {
    value: SLOTS_REPEAT.CURRENT_DATE,
    description: CHOOSE_SLOTS_MODAL.ONLY_CURRENT_DATE
  },
  {
    value: SLOTS_REPEAT.WEEKLY,
    description: CHOOSE_SLOTS_MODAL.REPEAT_WEEKLY
  },
  {
    value: SLOTS_REPEAT.DAILY,
    description: CHOOSE_SLOTS_MODAL.REPEAT_DAILY
  },
  {
    value: SLOTS_REPEAT.CUSTOM,
    description: CHOOSE_SLOTS_MODAL.CUSTOM
  }
]

export const WEEKDAY = {
  SUN: 'Sun',
  MON: 'Mon',
  TUE: 'Tue',
  WED: 'Wed',
  THU: 'Thu',
  FRI: 'Fri',
  SAT: 'Sat'
}

export const WEEKDAYS: { value: number, label: string }[] = [
  {
    value: 0,
    label: WEEKDAY.SUN
  },
  {
    value: 1,
    label: WEEKDAY.MON
  },
  {
    value: 2,
    label: WEEKDAY.TUE
  },
  {
    value: 3,
    label: WEEKDAY.WED
  },
  {
    value: 4,
    label: WEEKDAY.THU
  },
  {
    value: 5,
    label: WEEKDAY.FRI
  },
  {
    value: 6,
    label: WEEKDAY.SAT
  }
]

export const DELETE_SLOTS_MODAL = {
  CANCEL: 'Cancel',
  SUBMIT: 'Submit',
  DELETE_SELECT: 'Delete this event only',
  DELETE_ALL: 'Delete all future events',
  TITLE: 'Delete Event'
}

export const DELETE_SLOTS_MODAL_VALUES: { value: SlotType, description: string }[] = [
  {
    value: SLOTS_REPEAT.ONE,
    description: DELETE_SLOTS_MODAL.DELETE_SELECT
  },
  {
    value: SLOTS_REPEAT.ALL,
    description: DELETE_SLOTS_MODAL.DELETE_ALL
  }
]
