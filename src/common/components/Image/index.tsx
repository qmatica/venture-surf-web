import React, { FC, useState } from 'react'
import { getImageSrcFromBase64 } from 'common/utils'
import styles from './styles.module.sass'

interface IImage {
  photoURL: string
  photoBase64: string
  alt?: string
  userIcon: React.ComponentType<{ fill?: string }>
}

export const Image: FC<IImage> = ({
  photoURL, photoBase64, alt, userIcon: UserIcon
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(!photoURL)

  return (
    <>
      {!isImageLoaded && <div className={styles.skeleton} />}
      {photoURL || photoBase64
        ? (
          <img
            className={isImageLoaded ? styles.visible : styles.hidden}
            src={getImageSrcFromBase64(photoBase64, photoURL)}
            alt={alt || ''}
            onLoad={() => setIsImageLoaded(true)}
          />
        )
        : <UserIcon />}
    </>
  )
}
