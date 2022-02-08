import React, {
  FC, ReactElement, useEffect, useState
} from 'react'
import useSound from 'use-sound'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'common/types'
import {
  BulbIcon, CloseIcon, DiplomatIcon, GiftIcon, UserPhotoIcon
} from 'common/icons'
import phoneEnd from 'common/images/phoneEnd.png'
import phoneStart from 'common/images/phoneStart.png'
import videoStart from 'common/images/videoStart.png'
import { Image } from 'common/components/Image'
// @ts-ignore
import incomingCallAudio from 'common/audio/incomingCall.mp3'
import { connect, ConnectOptions } from 'twilio-video'
import { actions as actionsVideoChat } from 'features/VideoChat/actions'
import { actions as actionsConversations } from 'features/Conversations/actions'
import { useHistory } from 'react-router-dom'
import { declineCall, openChat } from 'features/Profile/actions'
import { getAllContacts } from 'features/Contacts/selectors'
import { UsersType, UserType } from 'features/User/types'
import moment from 'moment'
import { profileAPI } from 'api'
import cn from 'classnames'
import { accept, ignore } from 'features/Contacts/actions'
import { Button } from 'common/components/Button'
import { DropDownButton } from 'features/NavBar/components/DropDownButton'
import { getMyNotificationsHistory } from './selectors'
import { ScheduledMeetMsgs } from './components/ScheduledMeetMsgs'
import { actions } from './actions'
import styles from './styles.module.sass'

export const Notifications = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [playIncomingCall, { stop }] = useSound(incomingCallAudio)

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
      // TODO: Отправить на бэк accept call with deviceId для получения push при входе нового участника
      connect(incomingCall.token, {
        room: incomingCall.room,
        dominantSpeaker: true
      } as ConnectOptions)
        .then((room) => {
          dispatch(actionsVideoChat.setRoom(room, 'fixedThis'))
          dispatch(actions.removeIncomingCall())
          stop()
        }).catch((err) => {
          console.log(err)
          dispatch(actions.addErrorMsg(JSON.stringify(err)))
        })
    }
  }

  const onDeclineCall = () => {
    if (incomingCall) {
      stop()
      dispatch(actions.removeIncomingCall())
      dispatch(declineCall(incomingCall.uid))
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

            return (
              <div className={styles.msg} key={`notificationsMsgs-${msg.sid}`}>
                <div onClick={() => viewMessage(user.chat, msg.sid)}>
                  <div className={styles.photoContainer}>
                    <Image
                      photoURL={user.photoURL}
                      photoBase64={user.photoBase64}
                      alt={userName}
                      userIcon={UserPhotoIcon}
                    />
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

            return (
              <div className={styles.msg} key={`notificationsContacts-${uidMsg}`}>
                <div>
                  <div className={styles.photoContainer}>
                    <Image
                      photoURL={user.photoURL}
                      photoBase64={user.photoBase64}
                      alt={userName}
                      userIcon={UserPhotoIcon}
                    />
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
          <Image photoURL={incomingCall.photoURL} photoBase64="" userIcon={UserPhotoIcon} />
        </div>
        <div className={styles.displayName}>{incomingCall.name}</div>
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

const tempListIgnoredContacts = {} as UsersType

interface INotificationsList {
  icon: ReactElement
}

export const NotificationsList: FC<INotificationsList> = ({ icon }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const notificationsHistory = useSelector(getMyNotificationsHistory)
  const allContacts = useSelector(getAllContacts) as { mutuals: UsersType, sent: UsersType, received: UsersType }
  const [isOpenList, setIsOpenList] = useState(false)

  const toggleOpenList = () => setIsOpenList(!isOpenList)
  const closeList = () => setIsOpenList(false)

  const readAllNotifications = (id: string) => {
    profileAPI.readNotifications([id]).then((res) => console.log(res))
  }

  let countNotifications = 0

  const list = Object.entries(notificationsHistory)
    .filter(([id, value]) => !['call_instant', 'call_instant_group', 'call_canceled', 'call_declined'].includes(value.type))
    .sort((a, b) => moment(b[1].ts).unix() - moment(a[1].ts).unix())
    .map(([id, value]) => {
      let user = null as UserType | null
      let contactType = ''
      let background = false
      let title = ''
      let subTitle = null as string | null
      let icon = null
      const actions = []

      Object.entries(allContacts).some(([key, contacts]) => {
        const contact = contacts[value.contact]
        if (contacts[value.contact]) {
          contactType = key
          user = contact
          return true
        }
        return false
      })

      if (!user) {
        if (tempListIgnoredContacts[value.contact]) {
          user = tempListIgnoredContacts[value.contact]
          contactType = 'ignored'
        }
        if (!user) return null
      }

      const onOpenChat = () => {
        if (user) {
          closeList()
          const redirectToConversations = () => history.push('/conversations')
          dispatch(openChat(user.uid, redirectToConversations))
        }
      }

      if (value.status === 'active') {
        countNotifications += 1
      }

      const name = user.displayName || `${user.first_name} ${user.last_name}`

      switch (value.type) {
        case 'invest': {
          title = 'backed you up'
          icon = <DiplomatIcon />
          break
        }
        case 'like':
        case 'mutual_like': {
          title = 'is interested in your business'
          icon = <BulbIcon />
          background = contactType === 'received'

          if (background) {
            actions.push(
              {
                title: 'Add to mutuals',
                onClick: () => dispatch(accept(value.contact)),
                isLoading: user.loading?.includes('accept'),
                isDisabled: ['accept', 'ignore'].some((action) => user?.loading?.includes(action))
              },
              {
                title: 'Ignore',
                onClick: () => {
                  const addContactInTempListIgnore = () => {
                    tempListIgnoredContacts[value.contact] = user as UserType
                  }
                  dispatch(ignore(value.contact, addContactInTempListIgnore))
                },
                isLoading: user.loading?.includes('ignore'),
                isDisabled: ['accept', 'ignore'].some((action) => user?.loading?.includes(action))
              }
            )
          }
          if (contactType === 'mutuals') {
            subTitle = 'Added to mutuals'
            actions.push(
              {
                title: 'Chat',
                onClick: onOpenChat,
                isLoading: user.loading?.includes('openChat')
              }
            )
          }
          if (contactType === 'ignored') {
            subTitle = 'Request removed'
          }
          break
        }
        case 'intro': {
          title = 'recommended contact'
          icon = <GiftIcon />
          break
        }
        case 'intro_you': {
          title = 'recommended contact'
          icon = <GiftIcon />
          break
        }
        default: break
      }

      const buttons = actions.map((action) => {
        const className = action.title === 'Ignore' ? styles.cancel : styles.default

        return (
          <Button
            key={`${id} ${action.title}`}
            title={action.title}
            onClick={action.onClick}
            className={cn(
              className,
              action.title === 'Chat' && styles.chat
            )}
            disabled={action.isDisabled || action.isLoading}
          />
        )
      })

      return (
        <div
          key={id}
          contact-data={value.contact}
          type-data={value.type}
          date-data={value.ts}
          className={cn(
            styles.notificationItemContainer,
            background && styles.actionItem
          )}
        >
          <div className={styles.info}>
            <div className={styles.photoContainer}>
              <Image photoURL={user.photoURL} photoBase64="" userIcon={UserPhotoIcon} />
            </div>
            <div className={styles.name}>{name}</div>
            <div className={styles.title}>{title}</div>
            <div className={styles.iconContainer}>
              <div className={styles.icon}>
                {icon}
              </div>
            </div>
          </div>
          {subTitle && <div className={styles.subTitle}>{subTitle}</div>}
          {buttons.length > 0 && <div className={styles.buttons}>{buttons}</div>}
        </div>
      )
    })

  return (
    <DropDownButton
      icon={icon}
      list={<>{list}</>}
      arrow={false}
      countNotifications={countNotifications}
      isOpenList={isOpenList}
      onCloseList={closeList}
      onToggleOpenList={toggleOpenList}
    />
  )
}
