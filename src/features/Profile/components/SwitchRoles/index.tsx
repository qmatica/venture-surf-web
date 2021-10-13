import React, { FC, useEffect, useState } from 'react'
import { Button } from 'common/components/Button'
import { PlusIcon } from 'common/icons'
import { Modal } from 'features/Modal'
import { Input } from 'common/components/Input'
import { industries as dictionaryIndustries, stages as dictionaryStages } from 'common/constants'
import { ChoiceTags } from 'common/components/ChoiceTags'
import { useDispatch } from 'react-redux'
import styles from './styles.module.sass'
import { createNewRole, switchRole } from '../../actions'

interface ISwitchRoles {
  activeRole: 'founder' | 'investor'
  createdRoles: {
    founder: boolean,
    investor: boolean
  }
  isOnlyView: boolean
}

export const SwitchRoles: FC<ISwitchRoles> = ({ activeRole, createdRoles, isOnlyView }) => {
  const dispatch = useDispatch()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [step, setStep] = useState(1)
  const [stages, setStages] = useState<(string | number)[]>([])
  const [industries, setIndustries] = useState<(string | number)[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSwitchRole, setIsLoadingSwitchRole] = useState<'founder' | 'investor' | null>(null)

  useEffect(() => {
    if (isOpenModal) setIsOpenModal(false)
    if (isLoading) setIsLoading(false)
    if (isLoadingSwitchRole) setIsLoadingSwitchRole(null)
  }, [activeRole])

  let newRole = ''
  if (!createdRoles.founder) newRole = 'Founder'
  if (!createdRoles.investor) newRole = 'Investor'

  const titleStages = newRole === 'Founder' ? 'My startup space is' : 'My investors industries'
  const titleIndustries = newRole === 'Founder' ? 'My startup is' : 'My investments stages'

  const toggleModal = () => setIsOpenModal(!isOpenModal)
  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()

    const target = e.target as typeof e.target & {
      title: { value: string }
      headline: { value: string }
      company: { value: string }
      web: { value: string }
      email: { value: string }
    }

    const job = {
      title: target.title.value,
      headline: target.headline.value,
      company: target.company.value,
      web: target.web.value,
      email: target.email.value
    }

    const jobInfo = {
      job,
      stages,
      industries
    }

    setIsLoading(true)

    dispatch(createNewRole(newRole.toLowerCase() as 'investor' | 'founder', jobInfo))
  }

  const switchCurrentRole = (role: 'founder' | 'investor') => {
    setIsLoadingSwitchRole(role)
    dispatch(switchRole())
  }

  return (
    <>
      <div className={styles.container}>
        {createdRoles.founder ? (
          <Button
            title="Founder"
            className={activeRole !== 'founder' ? styles.default : styles.active}
            onClick={() => switchCurrentRole('founder')}
            isLoading={isLoadingSwitchRole === 'founder'}
            disabled={!!isLoadingSwitchRole || isOnlyView}
          />
        ) : !isOnlyView && <Button title="" icon={<PlusIcon />} className={styles.default} onClick={toggleModal} />}
        {createdRoles.investor ? (
          <Button
            title="Investor"
            className={activeRole !== 'investor' ? styles.default : styles.active}
            onClick={() => switchCurrentRole('investor')}
            isLoading={isLoadingSwitchRole === 'investor'}
            disabled={!!isLoadingSwitchRole || isOnlyView}
          />
        ) : !isOnlyView && <Button title="" icon={<PlusIcon />} className={styles.default} onClick={toggleModal} />}
      </div>
      <Modal title={`Create role: ${newRole}`} isOpen={isOpenModal} onClose={toggleModal}>
        <form onSubmit={onSubmit}>
          <div className={styles.createRoleContainer}>
            <div className={styles.stepContainer} style={{ display: step === 1 ? 'flex' : 'none' }}>
              <Input name="company" title="Company" placeholder="Type company" />
              <Input name="headline" title="Headline" placeholder="Type headline" />
              <Input name="title" title="Title" placeholder="Type title" />
              <Input name="web" title="Web" placeholder="Type web" />
              <Input name="email" title="Email" placeholder="Type email" />
            </div>
            <div className={styles.stepContainer} style={{ display: step === 2 ? 'flex' : 'none' }}>
              <div className={styles.title}>{titleStages}</div>
              <ChoiceTags tags={stages} onChange={setStages} dictionary={dictionaryStages[newRole.toLowerCase()]} />
            </div>
            <div className={styles.stepContainer} style={{ display: step === 3 ? 'flex' : 'none' }}>
              <div className={styles.title}>{titleIndustries}</div>
              <ChoiceTags tags={industries} onChange={setIndustries} dictionary={dictionaryIndustries} />
            </div>
            <div className={styles.buttonsContainer}>
              {step !== 1 && !isLoading && <Button title="Prev" onClick={prevStep} />}
              {step !== 3 && <Button title="Next" onClick={nextStep} />}
              {step === 3 && <Button title="Create" type="submit" isLoading={isLoading} />}
            </div>
          </div>
        </form>
      </Modal>
    </>
  )
}
