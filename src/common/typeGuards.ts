import { Job } from 'features/User/types'
import { ResultCompareContactsType, ResultCompareInstanceCallType } from '../features/Profile/types'

type ContactsOrCall = ResultCompareContactsType | ResultCompareInstanceCallType

export function determineNotificationContactsOrCall(result: ContactsOrCall): result is ResultCompareInstanceCallType {
  return !!(result as ResultCompareInstanceCallType).token
}

type JobOrJobWithActiveRole = { [key in 'founder' | 'investor']: Job } | Job

export function determineJobWithoutActiveRole(job: JobOrJobWithActiveRole): job is Job {
  return true
}

export function determineJobWithActiveRole(job: JobOrJobWithActiveRole): job is { [key in 'founder' | 'investor']: Job } {
  return true
}
