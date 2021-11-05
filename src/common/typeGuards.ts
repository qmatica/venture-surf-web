import { Job } from 'features/User/types'
import { ResultCompareContactsType, ResultCompareInstanceCallType } from '../features/Profile/types'

type ContactsOrCall = ResultCompareContactsType | ResultCompareInstanceCallType

export function determineNotificationContactsOrCall(result: ContactsOrCall): result is ResultCompareInstanceCallType {
  return !!(result as ResultCompareInstanceCallType).token
}

type JobOrJobWithActiveRole = { [key in 'founder' | 'investor']: Job } | Job

export function determineJobWithoutActiveRole(job: JobOrJobWithActiveRole): job is Job {
  return !!((job as Job).company || (job as Job).company === '' || (job as Job).company === null)
}
