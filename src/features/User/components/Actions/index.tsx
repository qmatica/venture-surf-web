import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from 'common/components/Button'
import { useDispatch } from 'react-redux'
import { callNow, openChat } from 'features/Profile/actions'
import styles from './styles.module.sass'
import { UserType } from '../../types'

interface IActions {
    user: UserType
}

export const Actions: FC<IActions> = ({ user }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const onCall = () => {
    dispatch(callNow(user.uid))
  }

  const onOpenChat = () => {
    const redirectToCreatedChat = () => history.push('conversations')
    dispatch(openChat(user.uid, redirectToCreatedChat))
  }

  const onArrangeAMeeting = () => {}

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
        onClick={onArrangeAMeeting}
        icon="calendar"
      />
      <Button
        title="Recommended"
        isLoading={false}
        onClick={onRecommended}
        icon="people"
      />
    </div>
  )
}
