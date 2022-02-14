import React, {
  FC, ReactElement, useEffect, useState
} from 'react'
import useSound from 'use-sound'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'common/types'
import {
  BulbIcon, CloseIcon, DiplomatIcon, GiftIcon, PreloaderIcon, UserPhotoIcon
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
import cn from 'classnames'
import { accept, ignore } from 'features/Contacts/actions'
import { Button } from 'common/components/Button'
import { DropDownButton } from 'features/NavBar/components/DropDownButton'
import { Dot } from 'common/components/Dot'
import { getIsLoadedHistory, getMyNotificationsHistory } from './selectors'
import { ScheduledMeetMsgs } from './components/ScheduledMeetMsgs'
import { actions, readAllNotificationsCurrentRole } from './actions'
import { getAllInvests, getMyActiveRole } from '../Profile/selectors'
import { acceptInvest, deleteInvest } from '../Surf/actions'
import { ValueNotificationsHistoryType } from './types'
import styles from './styles.module.sass'
import { ProfileType } from '../Profile/types'

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

interface INotificationsList {
  icon: ReactElement
}

export const NotificationsList: FC<INotificationsList> = ({ icon }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const notificationsHistory = useSelector(getMyNotificationsHistory)
  const isLoadedHistory = useSelector(getIsLoadedHistory)
  const allInvests = useSelector(getAllInvests)
  const myActiveRole = useSelector(getMyActiveRole)
  const allContacts = useSelector(getAllContacts) as {
    mutuals: UsersType,
    sent: UsersType,
    received: UsersType,
    additional: { [key: string]: ProfileType | null } | null
  }
  const [isOpenList, setIsOpenList] = useState(false)

  const notifications = {
    count: 0
  }

  const onReadAllNotifications = () => {
    if (isOpenList) {
      dispatch(readAllNotificationsCurrentRole())
    }
  }

  const toggleOpenList = () => {
    onReadAllNotifications()
    setIsOpenList(!isOpenList)
  }
  const closeList = () => {
    onReadAllNotifications()
    if (isOpenList) setIsOpenList(false)
  }

  const list = Object.entries(notificationsHistory)
    .sort((a, b) => moment(b[1].ts).unix() - moment(a[1].ts).unix())
    .reduce(((
      prevList: [string, ValueNotificationsHistoryType][],
      nextItem: [string, ValueNotificationsHistoryType]
    ) => {
      if (
        (nextItem[1].data.role && nextItem[1].data.role !== myActiveRole)
        || ['call_instant', 'call_instant_group', 'call_canceled', 'call_declined', 'twilio_enter_group'].includes(nextItem[1].type)
      ) {
        return prevList
      }
      const foundedIndexItem = prevList.findIndex((prevItem) =>
        prevItem[1].contact === nextItem[1].contact
        && prevItem[1].type === nextItem[1].type
        && !['intro', 'intro_you'].includes(nextItem[1].type))

      if (foundedIndexItem !== -1) {
        const updatedPrevList: [string, ValueNotificationsHistoryType][] = [...prevList]
        const updatedPrevItem: [string, ValueNotificationsHistoryType] = [...prevList[foundedIndexItem]]

        updatedPrevItem[1] = {
          ...updatedPrevItem[1],
          count: updatedPrevItem[1].count ? (updatedPrevItem[1].count + 1) : 2
        }

        updatedPrevList.splice(foundedIndexItem, 1, updatedPrevItem)

        return updatedPrevList
      }
      return [...prevList, nextItem]
    }), [])
    .map(([id, value]) => {
      let user = null as UserType | null
      let contactType = ''
      let background = false
      let title = ''
      let subTitle = null as string | null
      let icon = null
      const actions = []

      Object.entries(allContacts).some(([key, contacts]) => {
        if (!contacts) return false
        const contact = contacts[value.contact]
        if (contacts[value.contact]) {
          contactType = key
          user = contact as UserType | null
          return true
        }
        return false
      })

      if (!user) {
        user = {
          uid: value.contact,
          photoURL: '',
          displayName: 'Deleted',
          loading: allContacts.additional ? undefined : ['loading']
        } as UserType
      }

      const onOpenChat = () => {
        if (user) {
          const redirectToConversations = () => {
            closeList()
            history.push('/conversations')
          }
          dispatch(openChat(user.uid, redirectToConversations))
        }
      }

      if (value.status === 'active') {
        notifications.count += 1
      }

      const name = user.displayName || `${user.first_name} ${user.last_name}`
      const num = value.count ? `(${value.count})` : ''

      switch (value.type) {
        case 'invest': {
          title = 'backed you up'
          icon = <DiplomatIcon />

          background = allInvests[value.contact]?.status === 'requested'

          const list = `${myActiveRole === 'founder' ? 'investments' : 'investors'} list`

          if (background) {
            actions.push(
              {
                title: 'Accept',
                onClick: () => dispatch(acceptInvest(value.contact)),
                isLoading: user.loading?.includes('acceptInvest'),
                isDisabled: ['acceptInvest', 'declineInvest'].some((action) => user?.loading?.includes(action))
              },
              {
                title: 'Decline',
                onClick: () => dispatch(deleteInvest(value.contact)),
                isLoading: user.loading?.includes('declineInvest'),
                isDisabled: ['accept', 'declineInvest'].some((action) => user?.loading?.includes(action))
              }
            )
          } else if (allInvests[value.contact]?.status === 'accepted') {
            subTitle = `Added to ${list}`
          } else {
            subTitle = 'Request removed'
          }

          break
        }
        case 'like':
        case 'mutual_like': {
          title = 'is interested in your business'
          icon = <BulbIcon />
          background = contactType === 'received' && !user.ignored

          if (user.ignored) {
            subTitle = 'Request removed'
          }

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
                onClick: () => dispatch(ignore(value.contact)),
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
        const className = ['Ignore', 'Decline'].includes(action.title) ? styles.cancel : styles.default

        return (
          <Button
            key={`${id} ${action.title}`}
            title={action.title}
            onClick={action.onClick}
            className={cn(
              className,
              action.title === 'Chat' && styles.chat
            )}
            isLoading={action.isLoading}
            disabled={action.isDisabled || action.isLoading}
          />
        )
      })

      if (['additional', ''].includes(contactType)) {
        background = false
        buttons.length = 0
      }

      return (
        <div
          key={id}
          id-data={id}
          contact-data={value.contact}
          type-data={value.type}
          date-data={value.ts}
          className={cn(
            styles.notificationItemContainer,
            background && styles.actionItem
          )}
        >
          <div className={styles.date}>
            {moment(value.ts).calendar(null, {
              lastDay: '[Yesterday]',
              sameDay: 'HH:mm',
              nextDay: '[Tomorrow]',
              lastWeek: '[last] dddd',
              nextWeek: 'dddd',
              sameElse: 'L'
            })}
          </div>
          <div className={styles.info}>
            <div className={styles.photoWrapper}>
              <div className={styles.photoContainer}>
                {value.status === 'active' && <Dot top={-1} right={-1} />}
                <Image photoURL={user.photoURL} photoBase64="" userIcon={UserPhotoIcon} />
              </div>
            </div>
            <div className={styles.name}>
              {user.loading?.includes('loading')
                ? <div className={styles.loadingProfile}><div /></div>
                : name}
            </div>
            <div className={styles.title}>{title} {num}</div>
            <div className={styles.iconContainer}>
              <div className={styles.icon}>
                {icon}
              </div>
            </div>
          </div>
          {subTitle && (
            <div className={cn(styles.subTitle, user.ignored && styles.ignored)}>{subTitle}</div>
          )}
          {buttons.length > 0 && <div className={styles.buttons}>{buttons}</div>}
        </div>
      )
    })

  return (
    <DropDownButton
      icon={icon}
      list={isLoadedHistory ? <>{list}</> : <div className={styles.loading}><PreloaderIcon stroke="#96baf6" /></div>}
      arrow={false}
      countNotifications={notifications.count}
      isOpenList={isOpenList}
      onCloseList={closeList}
      onToggleOpenList={toggleOpenList}
    />
  )
}
