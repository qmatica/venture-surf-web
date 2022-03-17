import React, {
  createRef, FC, memo, RefObject, useEffect, useMemo, useState
} from 'react'
import {
  Participant as ParticipantType,
  RemoteParticipant,
  VideoTrack as VideoTrackType,
  AudioTrack as AudioTrackType,
  Track,
  AudioTrackPublication,
  VideoTrackPublication,
  LocalTrackPublication,
  LocalTrack
} from 'twilio-video'
import { Button } from 'common/components/Button'
import styles from './styles.module.sass'

interface IParticipant {
  participant: ParticipantType
  userName?: string
  dominantVideoRef?: RefObject<HTMLVideoElement>
  isDominant?: boolean
  muted?: boolean
  isHidden?: boolean
  onSendLike?: ((uid: string) => void) | null
}

export const Participant: FC<IParticipant> = memo(({
  participant, userName, dominantVideoRef, isDominant, muted, isHidden, onSendLike
}) => {
  const [videoTracks, setVideoTracks] = useState<(VideoTrackType | LocalTrack)[]>([])
  const [audioTracks, setAudioTracks] = useState<(AudioTrackType | LocalTrack)[]>([])
  const videoRef = createRef<HTMLVideoElement>()
  const audioRef = createRef<HTMLAudioElement>()

  const trackPubsToTracks = (trackMap: Map<Track.SID, (AudioTrackPublication | VideoTrackPublication)>) =>
    Array.from(trackMap.values()).map((publication: any) => publication.track).filter((track) => track !== null)

  const trackSubscribed = (track: VideoTrackType | AudioTrackType) => {
    console.log('SUBSCRIBED NEW TRACK: ', track)
    if (track.kind === 'video') {
      setVideoTracks((videoTracks) => [...videoTracks, track])
    } else if (track.kind === 'audio' && !muted) {
      setAudioTracks((audioTracks) => [...audioTracks, track])
    }
  }

  const trackUnsubscribed = (track: VideoTrackType | AudioTrackType) => {
    console.log('UNSUBSCRIBED TRACK: ', track)
    if (track.kind === 'video') {
      setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track))
    } else if (track.kind === 'audio') {
      setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track))
    }
  }

  // TODO: Refactor published/unPublished local tracks
  const trackPublished = (publication: LocalTrackPublication, remoteParticipant: RemoteParticipant) => {
    if (!remoteParticipant) {
      console.log('PUBLISHED NEW LOCAL TRACK: ', publication)
      if (publication.kind === 'video') {
        setVideoTracks((videoTracks) => [...videoTracks, publication.track])
      } else if (publication.kind === 'audio' && !muted) {
        setAudioTracks((audioTracks) => [...audioTracks, publication.track])
      }
    }
  }

  useEffect(() => {
    setVideoTracks(trackPubsToTracks(participant.videoTracks))
    if (!muted) setAudioTracks(trackPubsToTracks(participant.audioTracks))

    participant.on('trackSubscribed', trackSubscribed)
    participant.on('trackPublished', trackPublished)
    participant.on('trackUnsubscribed', trackUnsubscribed)
    return () => {
      setVideoTracks([])
      setAudioTracks([])
      participant.removeAllListeners()
    }
  }, [participant])

  useEffect(() => {
    const videoTrack = videoTracks[videoTracks.length - 1]
    if (videoRef.current) {
      // @ts-ignore
      videoTrack?.attach(videoRef.current)
      if (dominantVideoRef?.current) {
        if (isDominant) {
          // @ts-ignore
          videoTrack?.attach(dominantVideoRef.current)
        }
      }
    }
    return () => {
      // @ts-ignore
      videoTrack?.detach()
    }
  }, [videoTracks, isDominant])

  useEffect(() => {
    console.log('UPDATE AUDIO TRACKS: ', audioTracks)
    const audioTrack = audioTracks[audioTracks.length - 1]
    if (audioRef.current) {
      // @ts-ignore
      audioTrack?.attach(audioRef.current)
    }
    return () => {
      // @ts-ignore
      audioTrack?.detach()
    }
  }, [audioTracks])

  return (
    <div className={styles.container} style={{ display: isHidden ? 'none' : 'flex' }}>
      <video id={participant.sid} ref={videoRef} autoPlay />
      {!muted && <audio ref={audioRef} autoPlay />}
      {userName && <div className={styles.userName}>{userName}</div>}
      {onSendLike && (
        <ButtonLike onClick={() => onSendLike(participant.identity)} />
      )}
    </div>
  )
})

interface IButtonLike {
  onClick: () => void
}

const ButtonLike: FC<IButtonLike> = ({ onClick }) => {
  const [isDisabled, setIsDisabled] = useState(false)

  return (
    <Button
      title="Like"
      className={styles.likeButton}
      onClick={() => {
        onClick()
        setIsDisabled(true)
      }}
      disabled={isDisabled}
    />
  )
}
