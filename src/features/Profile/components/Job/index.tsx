import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'common/components/Button'
import { Modal } from 'features/Modal'
import { Input } from 'common/components/Input'
import { updateMyProfile } from '../../actions'
import { JobType } from '../../types'
import { getJob } from '../../selectors'
import styles from './styles.module.sass'

export const Job = ({ job, isEdit }: { job: JobType, isEdit: boolean }) => {
  const [isOpenModal, setIsOpenModal] = useState(false)

  useEffect(() => {
    if (isOpenModal) toggleModal()
  }, [job])

  const toggleModal = () => setIsOpenModal(!isOpenModal)

  const isEmptyJob = !job.company && !job.title && !job.headline

  return (
    <div className={styles.jobContainer}>
      {isEmptyJob ? isEdit && (
        <Button title="Add Job" onClick={toggleModal} />
      ) : (
        <>
          <div className={styles.fields}>
            {job.logoCompany && (
              <div className={styles.logoCompanyCompany}>
                <img src={job.logoCompany} alt="logo company" />
              </div>
            )}
            {job.headline && <div className={styles.headline}>{job.headline}</div>}
            {job.web && <a href={job.web} target="_blank" rel="noreferrer">Visit Website</a>}
          </div>
        </>
      )}
      <EditJob isOpen={isOpenModal} onClose={toggleModal} />
    </div>
  )
}

interface IEditJob {
  isOpen: boolean
  onClose: () => void
}

export const EditJob: FC<IEditJob> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const job = useSelector(getJob)
  const [isLoading, setIsLoading] = useState(false)

  const title = job ? 'Edit Job' : 'Add Job'

  const save = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const target = e.target as typeof e.target & {
      company: { value: string }
      title: { value: string }
      headline: { value: string }
      web: { value: string }
      email: { value: string }
    }
    const updatedJob = {
      company: target.company.value,
      title: target.title.value,
      headline: target.headline.value,
      web: target.web.value,
      email: target.email.value
    }

    const onFinish = () => {
      onClose()
      setIsLoading(false)
    }

    dispatch(updateMyProfile({ job: updatedJob }, onFinish))
  }

  return (
    <Modal title={title} onClose={onClose} isOpen={isOpen}>
      <form onSubmit={save}>
        <div className={styles.formJobContainer}>
          <div className={styles.inputs}>
            <Input name="company" placeholder="Type company" title="Company" initialValue={job?.company} />
            <Input name="title" placeholder="Type title" title="Title" initialValue={job?.title} />
            <Input name="headline" placeholder="Type headline" title="Headline" initialValue={job?.headline} />
            <Input name="web" placeholder="Type website" title="Website" initialValue={job?.web} />
            <Input name="email" placeholder="Type e-mail" title="E-mail" initialValue={job?.email} />
          </div>
          <div className={styles.buttons}>
            <Button title="Save" type="submit" isLoading={isLoading} />
            <Button title="Close" onClick={onClose} />
          </div>
        </div>
      </form>
    </Modal>
  )
}
