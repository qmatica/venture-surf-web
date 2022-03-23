import React, { FC, useState } from 'react'
import cn from 'classnames'
import { VIDEO_RECORDER } from 'features/Profile/constants'
import { RotateIcon, PauseIcon, Load } from 'common/icons'
import styles from './styles.module.sass'

export const RecordVideo: FC = () => {
  const [isOpenRecordModal, setIsOpenRecordModal] = useState(false)
  const toggleModal = () => setIsOpenRecordModal(!isOpenRecordModal)
  const [isStartRecord, setIsStartRecord] = useState(false)

  return (
    <div className={styles.container}>
      <div className={styles.videoBody}>
        <div className={styles.rotateButton}>
          {isStartRecord ? (
            <div className={styles.prepare}>
              <div>{VIDEO_RECORDER.PREPARE}</div>
              <div><Load /></div>
            </div>
          ) : (
            <div className={styles.rotate} onClick={() => { }}>
              <RotateIcon />
            </div>
          )}
        </div>
      </div>
      {isStartRecord ? (
        <div className={cn(styles.buttonGo, styles.pause)} onClick={() => setIsStartRecord(!isStartRecord)}>
          <PauseIcon />
        </div>
      ) : (
        <div
          onClick={() =>
            setIsStartRecord(!isStartRecord)}
          className={styles.buttonGo}
        >
          {VIDEO_RECORDER.GO}
        </div>
      )}
    </div>
  )
}
