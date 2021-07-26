import { getMutuals } from 'features/Contacts/selectors'
import React, { FC, memo } from 'react'
import { useSelector } from 'react-redux'

export const Mutuals: FC = memo(() => {
  const mutuals = useSelector(getMutuals)

  if (!mutuals?.length) {
    return (
      <div>
        No mutuals
      </div>
    )
  }

  return (
    <>
      <div>
        {mutuals.map(({
          photoURL, displayName, name, uid, job
        }) => (
          <div key={uid}>
            <div>
              <img style={{ width: '100px', height: '100px' }} src={photoURL} alt="" />
            </div>
            <div>{displayName || name}</div>
            <div>
              <div>{job?.company}</div>
              <div>{job?.title}</div>
              <div>{job?.headline}</div>
              <div>{job?.position}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
})
