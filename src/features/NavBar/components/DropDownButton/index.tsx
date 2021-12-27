import React, {
  FC, useState, ReactElement, useRef
} from 'react'
import { ArrowBottomIcon, PreloaderIcon } from 'common/icons'
import cn from 'classnames'
import { NavLink } from 'react-router-dom'
import { useOutside } from 'common/hooks'
import styles from './styles.module.sass'

type DropDownItemType = {
  title: string
  url?: string
  onClick?: () => void
  icon: ReactElement
  isLoading?: boolean
}

interface IDropDownButton {
  icon: ReactElement
  list: DropDownItemType[]
  isActive?: boolean
}

export const DropDownButton: FC<IDropDownButton> = ({ icon, list, isActive }) => {
  const dropDownEventRef = useRef(null)
  const [isOpenDropDownList, setIsOpenDropDownList] = useState(false)

  const closeDropDownList = () => {
    setIsOpenDropDownList(false)
  }

  useOutside(dropDownEventRef, closeDropDownList)

  return (
    <div className={styles.container} ref={dropDownEventRef}>
      <div
        className={cn(
          styles.button,
          isOpenDropDownList && styles.openDropDownList,
          isActive && styles.active
        )}
        onClick={() => setIsOpenDropDownList(!isOpenDropDownList)}
      >
        {icon} <ArrowBottomIcon />
      </div>
      {isOpenDropDownList && (
        <div className={styles.dropDownContainer}>
          {list.map((el) => {
            if (el.url) {
              return (
                <NavLink
                  to={el.url}
                  title="Profile"
                  activeClassName={styles.active}
                >
                  <div className={styles.icon}>
                    {el.icon}
                  </div>
                  {el.title}
                </NavLink>
              )
            }
            return (
              <div onClick={el.onClick}>
                <div className={styles.icon}>
                  {el.isLoading ? <PreloaderIcon stroke="#ccd5e4" /> : el.icon}
                </div>
                {el.title}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
