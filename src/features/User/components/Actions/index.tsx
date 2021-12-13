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
import { Recommend } from '../../../Recommend'

interface IActions {
    user: UserType
    userName: string
}

export const Actions: FC<IActions> = ({ user, userName }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [isOpenModalArrangeAMeeting, setIsOpenModalArrangeAMeeting] = useState(false)
  const [isOpenModalRecommend, setIsOpenModalRecommend] = useState(false)

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

  const toggleModalArrangeAMeeting = () => setIsOpenModalArrangeAMeeting(!isOpenModalArrangeAMeeting)

  const toggleModalRecommend = () => setIsOpenModalRecommend(!isOpenModalRecommend)

  const name = user.name || user.displayName || `${user.first_name} ${user.last_name}`

  return (
    <div className={styles.container}>
      <Button
        title="Call now"
        isLoading={user.loading?.includes('callNow')}
        className={styles.buttonCall}
        onClick={onCall}
        icon="phone"
        disabled={user.settings?.disable_instant_calls}
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
        onClick={toggleModalArrangeAMeeting}
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
        onClick={toggleModalRecommend}
        icon="people"
      />
      <Modal
        title="Arrange a meeting"
        isOpen={isOpenModalArrangeAMeeting}
        onClose={toggleModalArrangeAMeeting}
        width={935}
      >
        <Calendar otherSlots={slots} uid={user.uid} />
      </Modal>
      <Modal
        title={`Recommend ${userName} to:`}
        isOpen={isOpenModalRecommend}
        onClose={toggleModalRecommend}
        width={400}
      >
        <Recommend uid={user.uid} onClose={toggleModalRecommend} />
      </Modal>
    </div>
  )
}
