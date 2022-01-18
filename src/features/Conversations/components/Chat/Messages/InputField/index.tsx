import React, { FC, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FieldValues, useForm } from 'react-hook-form'
import { SendMessageIcon } from 'common/icons'
import cn from 'classnames'
import ReactTooltip from 'react-tooltip'
import { sendMessage } from '../../../../actions'
import { getOpenedChat } from '../../../../selectors'
import styles from './styles.module.sass'

interface IInputField {
  scrollToBottom: () => void
}

export const InputField: FC<IInputField> = ({ scrollToBottom }) => {
  const dispatch = useDispatch()
  const textInputContainerRef = useRef<HTMLDivElement>(null)
  const {
    register, handleSubmit, formState: { errors }, reset, clearErrors
  } = useForm()

  const openedChat = useSelector(getOpenedChat)

  useEffect(() => {
    if (textInputContainerRef.current) {
      if (errors.message?.type === 'maxLength') {
        ReactTooltip.show(textInputContainerRef.current)
      }
      if (!errors.message) {
        ReactTooltip.hide()
      }
    }
  }, [errors.message?.type])

  const onSubmit = (values: FieldValues) => {
    const trimMessage = values.message.trim()

    if (!trimMessage) return

    scrollToBottom()

    dispatch(sendMessage(trimMessage, openedChat))

    reset()
  }

  return (
    <div className={cn(styles.container, errors.message && styles.error)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ReactTooltip
          type="info"
          disable={!errors.message || errors.message?.type !== 'maxLength'}
        />
        <div
          ref={textInputContainerRef}
          className={styles.textInputContainer}
          data-tip="Max length 700 chars"
          data-place="bottom"
          data-effect="solid"
        >
          <input
            {...register('message', {
              required: true,
              maxLength: 4,
              onBlur: () => {
                if (errors.message?.type === 'required') clearErrors()
              },
              onChange: (e) => {
                if (!e.target.value) {
                  setTimeout(() => {
                    clearErrors()
                  }, 100)
                }
              }
            })}
            className={styles.textInput}
            type="text"
            placeholder="Type message"
            autoComplete="off"
          />
        </div>
        <button type="submit" className={styles.sendMessageButton}>
          <SendMessageIcon />
        </button>
      </form>
    </div>
  )
}
