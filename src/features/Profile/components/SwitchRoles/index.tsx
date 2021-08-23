import React, { FC, useState } from 'react'
import { Button } from 'common/components/Button'
import { PlusIcon } from 'common/icons'
import { Modal } from 'features/Modal'
import { Input } from 'common/components/Input'
import { industries as dictionaryIndustries, stages as dictionaryStages } from 'common/constants'
import { ChoiceTags } from 'common/components/ChoiceTags'
import styles from './styles.module.sass'

interface ISwitchRoles {
  activeRole: 'founder' | 'investor'
  createdRoles: {
    founder: boolean,
    investor: boolean
  }
}

export const SwitchRoles: FC<ISwitchRoles> = ({ activeRole, createdRoles }) => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [step, setStep] = useState(1)
  const [stages, setStages] = useState<(string | number)[]>([])
  const [industries, setIndustries] = useState<(string | number)[]>([])
  const [isLoading, setIsLoading] = useState(false)

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

    console.log(job)
    console.log(stages)
    console.log(industries)
    setIsLoading(true)
  }

  return (
    <>
      <div className={styles.container}>
        {createdRoles.founder
          ? <Button title="Founder" className={activeRole !== 'founder' ? styles.noActive : ''} />
          : <Button title="" icon={<PlusIcon />} className={styles.noActive} onClick={toggleModal} />}
        {createdRoles.investor
          ? <Button title="Investor" className={activeRole !== 'investor' ? styles.noActive : ''} />
          : <Button title="" icon={<PlusIcon />} className={styles.noActive} onClick={toggleModal} />}
      </div>
      <Modal title={`Create role: ${newRole}`} isOpen={isOpenModal} onClose={toggleModal}>
        <form onSubmit={onSubmit}>
          <div className={styles.createRoleContainer}>
            <div className={styles.stepContainer} style={{ display: step === 1 ? 'flex' : 'none' }}>
              <Input name="title" title="Title" placeholder="Type title" />
              <Input name="headline" title="Headline" placeholder="Type headline" />
              <Input name="company" title="Company" placeholder="Type company" />
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
