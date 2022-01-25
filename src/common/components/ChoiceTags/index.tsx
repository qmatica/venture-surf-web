import React, {
  FC, useEffect, useState
} from 'react'
import { Tag } from 'common/components/Tag'
import { PlusIcon } from 'common/icons'
import { FieldValues, useForm } from 'react-hook-form'
import cn from 'classnames'
import styles from './styles.module.sass'

interface ITags {
    tags: (string | number)[]
    dictionary?: { [key: string]: string } | string[]
    onChange: (value: (string | number)[]) => void
}

export const ChoiceTags: FC<ITags> = ({ tags, dictionary, onChange }) => {
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setFocus,
    setValue,
    formState: { errors },
    clearErrors,
    reset
  } = useForm()

  useEffect(() => {
    if (!dictionary) setFocus('tag')
  }, [dictionary])

  let filteredAvailableTags: (string | number)[] = []
  if (dictionary) {
    const availableTags: (string | number)[] = Array.isArray(dictionary)
      ? dictionary
      : Object.keys(dictionary).map((key) => parseInt(key, 10))
    filteredAvailableTags = availableTags.filter((tag) => !tags.includes(tag))
  }

  const addTag = (tag: string | number) => onChange([...tags, tag])
  const removeTag = (tag: string | number) => onChange(tags.filter((tagValue) => tagValue !== tag))

  const onSubmit = (values: FieldValues) => {
    const { tag } = values
    if (tags.includes(tag.trim())) {
      setError('This keyword has already been added')
      setFocus('tag')
      return
    }
    addTag(tag.trim())
    reset()
  }

  return (
    <div className={styles.content}>
      <div className={styles.section}>
        {tags.length > 0 ? tags.map((tag: string | number) => (
          <Tag
            key={tag}
            value={tag}
            dictionary={dictionary}
            remove={() => removeTag(tag)}
          />
        )) : (
          <div className={styles.empty}>Empty</div>
        )}
      </div>
      {filteredAvailableTags.length > 0 && (
      <div className={styles.section}>
        {filteredAvailableTags.map((tag) => (
          <Tag
            key={tag}
            value={tag}
            dictionary={dictionary}
            add={() => addTag(tag)}
          />
        ))}
      </div>
      )}
      {!dictionary && (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputContainer}>
          <input
            {...register('tag', {
              required: true,
              maxLength: 30,
              onBlur: () => {
                if (errors.tag?.type === 'required') clearErrors()
              },
              onChange: (e) => {
                const { value } = e.target
                if (!value) {
                  setTimeout(() => {
                    clearErrors()
                  }, 100)
                }
                if (error) setError(null)
                const validatedValue = value.length === 1 ? value.trim() : value
                setValue('tag', validatedValue)
              }
            })}
            type="text"
            className={cn(styles.input, errors.tag && styles.errorInput)}
            autoComplete="off"
            placeholder="Type keyword"
          />
          <button
            type="submit"
            className={styles.button}
          >
            <PlusIcon />
          </button>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {errors.tag?.type === 'maxLength' && <div className={styles.error}>Max length 30 chars</div>}
      </form>
      )}
    </div>
  )
}
