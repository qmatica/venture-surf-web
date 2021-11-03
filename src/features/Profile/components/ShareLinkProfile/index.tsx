import React, { FC } from 'react'
import { Button } from 'common/components/Button'
import { useDispatch, useSelector } from 'react-redux'
import { getLoadersProfile } from 'features/Profile/selectors'
import styles from './styles.module.sass'
import { shareLinkMyProfile } from '../../actions'

interface IShareLinkProfile {
  isEdit: boolean
}

export const ShareLinkProfile: FC<IShareLinkProfile> = ({ isEdit }) => {
  const dispatch = useDispatch()
  const loaders = useSelector(getLoadersProfile)

  const onClick = () => {
    dispatch(shareLinkMyProfile())
  }

  if (!isEdit) return null

  return (
    <div className={styles.container}>
      <Button
        title="Share link for my profile"
        onClick={onClick}
        isLoading={loaders.includes('shareMyProfile')}
      />
    </div>
  )
}
