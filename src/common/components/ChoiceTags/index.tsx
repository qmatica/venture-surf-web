import React, {
  FC, useEffect, useRef, useState
} from 'react'
import { Tag } from 'common/components/Tag'
import { PlusIcon } from 'common/icons'
import styles from './styles.module.sass'

interface ITags {
    tags: (string | number)[]
    dictionary?: { [key: string]: string } | string[]
    onChange: (value: (string | number)[]) => void
}

export const ChoiceTags: FC<ITags> = ({ tags, dictionary, onChange }) => {
  const [newTag, setNewTag] = useState('')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!dictionary) inputRef.current?.focus()
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

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (tags.includes(newTag.trim())) {
      setError('This keyword has already been added')
      inputRef.current?.focus()
      return
    }
    if (newTag.length === 0) {
      setError('You cannot add an empty keyword')
      inputRef.current?.focus()
      return
    }
    addTag(newTag.trim())
    setNewTag('')
    inputRef.current?.focus()
  }

  const onChangeInput = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null)
    const validatedValue = value.length === 1 ? value.trim() : value
    setNewTag(validatedValue)
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
      <form onSubmit={handleSubmit}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            className={styles.input}
            placeholder="Type keyword"
            ref={inputRef}
            value={newTag}
            onChange={onChangeInput}
          />
          <button
            type="submit"
            className={styles.button}
          >
            <PlusIcon />
          </button>
        </div>
        {error && <div className={styles.error}>{error}</div>}
      </form>
      )}
    </div>
  )
}
