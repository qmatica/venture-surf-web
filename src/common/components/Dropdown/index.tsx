import React, { FC, useRef, useState } from 'react'
import { ArrowBottomIcon, PreloaderIcon } from 'common/icons'
import { useOutside } from 'common/hooks'
import styles from './styles.module.sass'

interface IDropdown {
  type?: 'submit' | 'button'
  onClick?: () => void
  isLoading?: boolean
  title: string
  className?: string
  disabled?: boolean
  options?: string[]
}

export const Dropdown: FC<IDropdown> = ({
  onClick = (e?: any) => { },
  isLoading = false,
  title,
  options,
  disabled
}) => {
  const DropdownRef = useRef(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(title)

  useOutside(DropdownRef, () => setIsMenuOpen(false))

  return (
    <div className={styles.dropdownWrapper} ref={DropdownRef}>
      <div
        className={`${styles.dropdownSelectedItem} ${isMenuOpen && styles.dropdownExpanded}`}
        onClick={() => !disabled && setIsMenuOpen(!isMenuOpen)}
      >
        {isLoading
          ? <PreloaderIcon stroke="#96baf6" />
          : <>{selectedOption} {!!options?.length && <ArrowBottomIcon />}</>}
      </div>
      {isMenuOpen && !!options?.length && (
        <div className={styles.dropdownMenu}>
          {options?.filter((option) => option !== selectedOption).map((option) => (
            <div
              className={styles.dropdownMenuItem}
              onClick={(e) => {
                onClick(e)
                setSelectedOption(option)
                setIsMenuOpen(false)
              }}
            >{option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
