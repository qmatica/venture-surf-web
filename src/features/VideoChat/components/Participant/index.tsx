import React, {
  createRef, FC, memo, useEffect, useState
} from 'react'
import {
  Participant as ParticipantType,
  VideoTrack as VideoTrackType,
  AudioTrack as AudioTrackType,
  Track,
  AudioTrackPublication,
  VideoTrackPublication
} from 'twilio-video'
import styles from './styles.module.sass'

interface IParticipant {
  participant: ParticipantType
  style?: {
    [key: string]: any
  }
}

export const Participant: FC<IParticipant> = memo(({ participant, style }) => {
  const [videoTracks, setVideoTracks] = useState<VideoTrackType[]>([])
  const [audioTracks, setAudioTracks] = useState<AudioTrackType[]>([])
  const videoRef = createRef<HTMLVideoElement>()
  const audioRef = createRef<HTMLAudioElement>()

  const trackPubsToTracks = (trackMap: Map<Track.SID, (AudioTrackPublication | VideoTrackPublication)>) =>
    Array.from(trackMap.values()).map((publication: any) => publication.track).filter((track) => track !== null)

  const trackSubscribed = (track: VideoTrackType | AudioTrackType) => {
    if (track.kind === 'video') {
      setVideoTracks((videoTracks) => [...videoTracks, track])
    } else if (track.kind === 'audio') {
      setAudioTracks((audioTracks) => [...audioTracks, track])
    }
  }

  const trackUnsubscribed = (track: VideoTrackType | AudioTrackType) => {
    if (track.kind === 'video') {
      setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track))
    } else if (track.kind === 'audio') {
      setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track))
    }
  }

  useEffect(() => {
    setVideoTracks(trackPubsToTracks(participant.videoTracks))
    setAudioTracks(trackPubsToTracks(participant.audioTracks))

    participant.on('trackSubscribed', trackSubscribed)
    participant.on('trackUnsubscribed', trackUnsubscribed)
    return () => {
      setVideoTracks([])
      setAudioTracks([])
      participant.removeAllListeners()
    }
  }, [participant])

  useEffect(() => {
    const videoTrack = videoTracks[0]
    if (videoRef.current) {
      videoTrack?.attach(videoRef.current)
    }
    return () => {
      videoTrack?.detach()
    }
  }, [videoTracks])

  useEffect(() => {
    const audioTrack = audioTracks[0]
    if (audioRef.current) {
      audioTrack?.attach(audioRef.current)
    }
    return () => {
      audioTrack?.detach()
    }
  }, [audioTracks])

  return (
    <div className={styles.container} style={style}>
      <video ref={videoRef} autoPlay />
      <audio ref={audioRef} autoPlay />
    </div>
  )
})
