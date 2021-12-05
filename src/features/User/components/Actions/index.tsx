import React, { FC, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from 'common/components/Button'
import { useDispatch } from 'react-redux'
import { callNow, openChat } from 'features/Profile/actions'
import { shareLinkProfile } from 'features/Contacts/actions'
import { Modal } from 'features/Modal'
import { Calendar } from 'features/Calendar'
import moment from 'moment'
import { FormattedSlotsType } from 'features/Calendar/types'
import styles from './styles.module.sass'
import { UserType } from '../../types'

interface IActions {
    user: UserType
}

export const Actions: FC<IActions> = ({ user }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [isOpenModalArrangeAMeeting, setIsOpenModalArrangeAMeeting] = useState(false)

  const slots = useMemo(() => {
    const formattedSlots: FormattedSlotsType = []

    if (user.slots) {
      Object.entries(user.slots).forEach(([date, value]: any) => {
        formattedSlots.push({
          date: moment(`${date
            .replace('Z', '')
            .replace('W', '')
            .replace('D1', '')
            .replace('D2', '')
            .replace('D', '')}Z`).format('YYYY-MM-DDTHH:mm:00'),
          ...value
        })
      })
    }
    return formattedSlots
  }, [user])

  const onCall = () => {
    dispatch(callNow(user.uid))
  }

  const onOpenChat = () => {
    const redirectToConversations = () => history.push('conversations')
    dispatch(openChat(user.uid, redirectToConversations))
  }

  const onShareLinkProfile = () => {
    dispatch(shareLinkProfile(user.uid))
  }

  const toggleIsOpenModalArrangeAMeeting = () => setIsOpenModalArrangeAMeeting(!isOpenModalArrangeAMeeting)

  const onRecommended = () => {}

  return (
    <div className={styles.container}>
      <Button
        title="Call now"
        isLoading={user.loading?.includes('callNow')}
        className={styles.buttonCall}
        onClick={onCall}
        icon="phone"
      />
      <Button
        title="Open chat"
        isLoading={user.loading?.includes('openChat')}
        onClick={onOpenChat}
        icon="mail"
      />
      <Button
        title="Arrange a meeting"
        isLoading={false}
        onClick={toggleIsOpenModalArrangeAMeeting}
        icon="calendar"
      />
      <Button
        title="Share link profile"
        isLoading={user.loading?.includes('shareLinkProfile')}
        onClick={onShareLinkProfile}
      />
      <Button
        title="Recommended"
        isLoading={false}
        onClick={onRecommended}
        icon="people"
      />
      <Modal
        title="Arrange a meeting"
        isOpen={isOpenModalArrangeAMeeting}
        onClose={toggleIsOpenModalArrangeAMeeting}
        width={935}
      >
        <Calendar otherSlots={slots} uid={user.uid} />
      </Modal>
    </div>
  )
}
