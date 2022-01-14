import React, { useEffect, useState } from 'react'
import useSound from 'use-sound'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'common/types'
import { CloseIcon, UserPhotoIcon, LoadingSkeleton } from 'common/icons'
import phoneEnd from 'common/images/phoneEnd.png'
import phoneStart from 'common/images/phoneStart.png'
import videoStart from 'common/images/videoStart.png'
import { getImageSrcFromBase64 } from 'common/utils'
// @ts-ignore
import incomingCallAudio from 'common/audio/incomingCall.mp3'
import { connect, ConnectOptions } from 'twilio-video'
import { actions as actionsVideoChat } from 'features/VideoChat/actions'
import { actions as actionsConversations } from 'features/Conversations/actions'
import { useHistory } from 'react-router-dom'
import { declineCall } from 'features/Profile/actions'
import { actions } from './actions'
import { ScheduledMeetMsgs } from './components/ScheduledMeetMsgs'
import styles from './styles.module.sass'

export const Notifications = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [playIncomingCall, { stop }] = useSound(incomingCallAudio)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const {
    anyMsgs, errorMsg, contactsEventsMsgs, receivedChatMsgs, incomingCall, scheduledMeetMsgs
  } = useSelector((state: RootState) => state.notifications)

  useEffect(() => {
    if (incomingCall) {
      console.log('incomingCall')
      playIncomingCall()
    }
  }, [incomingCall])

  const removeErrorMsg = () => dispatch(actions.removeErrorMsg())

  const replyWithVideo = () => {
    if (incomingCall) {
      connect(incomingCall.data.token, {
        room: incomingCall.data.room,
        dominantSpeaker: true
      } as ConnectOptions)
        .then((room) => {
          dispatch(actionsVideoChat.setRoom(room, 'fixedThis'))
          dispatch(actions.removeIncomingCall())
          stop()
        }).catch((err) => {
          dispatch(actions.addErrorMsg(JSON.stringify(err)))
        })
    }
  }

  const onDeclineCall = () => {
    if (incomingCall) {
      stop()
      dispatch(actions.removeIncomingCall())
      dispatch(declineCall(incomingCall.data.uid))
    }
  }

  const removeReceivedChatMsg = (sid: string) => {
    dispatch(actions.removeReceivedChatMsg(sid))
  }

  const removeContactsEnentsMsg = (uidMsg: string) => {
    dispatch(actions.removeContactsEventMsg(uidMsg))
  }

  const removeAnyMsg = (uid: string) => {
    dispatch(actions.removeAnyMsg(uid))
  }

  const viewMessage = (chat: string | undefined, sid: string) => {
    if (chat) {
      removeReceivedChatMsg(sid)
      history.push('conversations')
      dispatch(actionsConversations.setOpenedChat(chat))
    }
  }

  return (
    <>
      {errorMsg && (
        <div className={styles.errorMsgContainer} title={errorMsg}>
          {errorMsg}
          <div className={styles.close} onClick={removeErrorMsg}>
            <CloseIcon />
          </div>
        </div>
      )}

      {(scheduledMeetMsgs.length > 0
        || receivedChatMsgs.length > 0
        || contactsEventsMsgs.length > 0
        || anyMsgs.length > 0) && (
        <div className={styles.rightSideMsgsContainer}>
          {receivedChatMsgs.map(({ user, msg }) => {
            const userName = user.displayName || `${user.first_name} ${user.last_name}`
            if (!user.photoURL && !user.photoBase64 && !isImageLoaded) setIsImageLoaded(true)

            return (
              <div className={styles.msg} key={`notificationsMsgs-${msg.sid}`}>
                <div onClick={() => viewMessage(user.chat, msg.sid)}>
                  {!isImageLoaded && <div><LoadingSkeleton /></div>}
                  <div className={styles.photoContainer}>
                    {user.photoURL || user.photoBase64
                      ? (
                        <img
                          src={getImageSrcFromBase64(user.photoBase64, user.photoURL)}
                          alt={userName}
                          className={isImageLoaded ? styles.visible : styles.hidden}
                          onLoad={() => !isImageLoaded && setIsImageLoaded(true)}
                        />
                      )
                      : <UserPhotoIcon />}
                  </div>
                  <div className={styles.contentContainer}>
                    <div className={styles.displayName}>{userName}</div>
                    <div className={styles.text}>{msg.body}</div>
                  </div>
                </div>
                <div className={styles.close} onClick={() => removeReceivedChatMsg(msg.sid)}><CloseIcon /></div>
              </div>
            )
          })}
          {contactsEventsMsgs.map(({ user, msg, uidMsg }) => {
            const userName = user.displayName || `${user.first_name} ${user.last_name}`
            if (!user.photoURL && !user.photoBase64 && !isImageLoaded) setIsImageLoaded(true)

            return (
              <div className={styles.msg} key={`notificationsContacts-${uidMsg}`}>
                <div>
                  <div className={styles.photoContainer}>
                    {!isImageLoaded && <div><LoadingSkeleton /></div>}
                    {user.photoURL || user.photoBase64
                      ? (
                        <img
                          src={getImageSrcFromBase64(user.photoBase64, user.photoURL)}
                          alt={userName}
                          className={isImageLoaded ? styles.visible : styles.hidden}
                          onLoad={() => !isImageLoaded && setIsImageLoaded(true)}
                        />
                      )
                      : <UserPhotoIcon />}
                  </div>
                  <div className={styles.contentContainer}>
                    <div className={styles.displayName}>{userName}</div>
                    <div className={styles.text}>{msg}</div>
                  </div>
                </div>
                <div className={styles.close} onClick={() => removeContactsEnentsMsg(uidMsg)}><CloseIcon /></div>
              </div>
            )
          })}
          {anyMsgs.map(({ msg, uid }) => (
            <div className={styles.msg} key={`notificationsMsgs-${uid}`} style={{ cursor: 'pointer' }}>
              <div>
                <div className={styles.contentContainer}>
                  <div className={styles.text}>{msg}</div>
                </div>
              </div>
              <div className={styles.close} onClick={() => removeAnyMsg(uid)}><CloseIcon /></div>
            </div>
          ))}
          <ScheduledMeetMsgs msgs={scheduledMeetMsgs} />
        </div>
      )}

      {incomingCall && (
      <div className={styles.incomingCallContainer}>
        <div className={styles.photoContainer}>
          <UserPhotoIcon />
        </div>
        <div className={styles.displayName}>{incomingCall.notification.body}</div>
        <div className={styles.event}>Incoming call...</div>
        <div className={styles.buttonsContainer}>
          <div className={styles.button} onClick={onDeclineCall}>
            <img src={phoneEnd} alt="Throw off" />
          </div>
          {/*<div className={styles.button}>*/}
          {/*  <img src={phoneStart} alt="Reply without video" />*/}
          {/*</div>*/}
          <div className={styles.button} onClick={replyWithVideo}>
            <img src={videoStart} alt="Reply with video" />
          </div>
        </div>
      </div>
      )}
    </>
  )
}
