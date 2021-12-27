import React, { useCallback, FC } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from './styles.module.sass'

interface IDropZone {
    setSelectedVideo: (selectedVideo: File) => void
    progressLoadingFile: number | null
}

export const DropZone: FC<IDropZone> = ({ setSelectedVideo, progressLoadingFile }) => {
  const onDrop = useCallback((acceptedFiles) => {
    setSelectedVideo(acceptedFiles[0])
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div
      className={styles.container}
      style={{
        height: progressLoadingFile ? 'inherit' : '300px',
        paddingBottom: progressLoadingFile ? '20px' : '0px'
      }}
    >
      {progressLoadingFile ? (
        <div className={styles.progressBarContainer}>
          <div className={styles.progress} style={{ width: `${progressLoadingFile}%` }} />
          <div className={styles.wrapper} />
        </div>
      ) : (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <div className={styles.dropZone} style={{ borderColor: isDragActive ? '#98bdff' : '#D7DFED' }}>
            {isDragActive
              ? (
                <div>Drop video here</div>
              )
              : (
                <>
                  <div>Click</div>
                  <div>or</div>
                  <div>Drop video here</div>
                </>
              )}
          </div>
        </div>
      )}
    </div>
  )
}
