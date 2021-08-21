import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { getReceived } from '../../selectors'
import { User } from '../../../User'

export const Received: FC = () => {
  const received = useSelector(getReceived)
  return (
    <div>
      {received.map((user) => (
        <User
          key={user.uid}
          user={user}
        />
      ))}
    </div>
  )
}
