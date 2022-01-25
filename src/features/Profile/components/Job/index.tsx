import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'common/components/Button'
import { Modal } from 'features/Modal'
import { Input } from 'common/components/Input'
import { FieldValues, useForm } from 'react-hook-form'
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
  const {
    register, handleSubmit, formState: { errors }, reset
  } = useForm()
  const job = useSelector(getJob)
  const [isLoading, setIsLoading] = useState(false)

  const title = job ? 'Edit Job' : 'Add Job'

  useEffect(() => {
    if (!isOpen) reset()
  }, [isOpen])

  const save = (values: FieldValues) => {
    if (!values) return
    setIsLoading(true)

    const onFinish = () => {
      onClose()
      setIsLoading(false)
    }

    dispatch(updateMyProfile({ job: values }, onFinish))
  }

  return (
    <Modal title={title} onClose={onClose} isOpen={isOpen}>
      <form onSubmit={handleSubmit(save)}>
        <div className={styles.formJobContainer}>
          <div className={styles.inputs}>
            <Input
              {...register('company', {
                maxLength: 70
              })}
              placeholder="Type company"
              title="Company"
              defaultValue={job?.company}
              errorMsg={errors.company && 'Max length 70 chars'}
            />
            <Input
              {...register('title', {
                maxLength: 70
              })}
              placeholder="Type title"
              title="Title"
              defaultValue={job?.title}
              errorMsg={errors.title && 'Max length 70 chars'}
            />
            <Input
              {...register('headline', {
                maxLength: 70
              })}
              placeholder="Type headline"
              title="Headline"
              defaultValue={job?.headline}
              errorMsg={errors.headline && 'Max length 70 chars'}
            />
            <Input
              {...register('web', {
                pattern: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\\.-]+)+[\w\-\\._~:/?#[\]@!\\$&'\\(\\)\\*\\+,;=.]+$/gm
              })}
              placeholder="Type website"
              title="Website"
              defaultValue={job?.web}
              errorMsg={errors.web && 'Enter correct website'}
            />
            <Input
              {...register('email', {
                pattern: /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
              })}
              placeholder="Type e-mail"
              title="E-mail"
              defaultValue={job?.email}
              errorMsg={errors.email && 'Enter correct e-mail'}
            />
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
