import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button } from 'common/components/Button'
import { Modal } from 'features/Modal'
import { Input } from 'common/components/Input'
import { Edit2Icon } from 'common/icons'
import { updateMyProfile } from '../../actions'
import { JobType } from '../../types'
import styles from './styles.module.sass'

export const Job = ({ job }: { job: JobType }) => {
  const dispatch = useDispatch()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpenModal) toggleModal()
    if (isLoading) setIsLoading(false)
  }, [job])

  const toggleModal = () => setIsOpenModal(!isOpenModal)

  const save = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const target = e.target as typeof e.target & {
      company: { value: string }
      title: { value: string }
      headline: { value: string }
    }
    const updatedJob = {
      company: target.company.value,
      title: target.title.value,
      headline: target.headline.value
    }
    dispatch(updateMyProfile({ job: updatedJob }))
  }

  const isEmptyJob = !job.company && !job.title && !job.headline
  const titleModal = isEmptyJob ? 'Add Job' : 'Edit Job'

  return (
    <div className={styles.jobContainer}>
      {isEmptyJob ? (
        <Button title="Add Job" onClick={toggleModal} />
      ) : (
        <>
          <div className={styles.fields}>
            {job.company && <div className={styles.company}>{job.company}</div>}
            {job.title && <div className={styles.title}>{job.title}</div>}
            {job.headline && <div className={styles.headline}>{job.headline}</div>}
          </div>
          <div className={styles.edit} onClick={toggleModal}>
            <Button title="Edit" icon={<Edit2Icon size="17" />} />
          </div>
        </>
      )}
      <Modal title={titleModal} onClose={toggleModal} isOpen={isOpenModal}>
        <form onSubmit={save}>
          <div className={styles.formJobContainer}>
            <div className={styles.inputs}>
              <Input name="company" placeholder="Type company" title="Company" initialValue={job.company} />
              <Input name="title" placeholder="Type title" title="Title" initialValue={job.title} />
              <Input name="headline" placeholder="Type headline" title="Headline" initialValue={job.headline} />
            </div>
            <div className={styles.buttons}>
              <Button title="Save" type="submit" isLoading={isLoading} />
              <Button title="Close" onClick={toggleModal} />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}
