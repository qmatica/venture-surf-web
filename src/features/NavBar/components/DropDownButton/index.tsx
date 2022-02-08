import React, {
  FC, useState, ReactElement, useRef, useEffect, Ref
} from 'react'
import { ArrowBottomIcon, PreloaderIcon } from 'common/icons'
import cn from 'classnames'
import { NavLink } from 'react-router-dom'
import { useOutside } from 'common/hooks'
import { DropDownItemType } from 'features/NavBar/types'
import { determineArray } from 'common/typeGuards'
import { CounterNotifications } from 'common/components/CounterNotifications'
import styles from './styles.module.sass'

interface IDropDownButton {
  icon: ReactElement
  list: DropDownItemType[] | ReactElement
  isActive?: boolean
  arrow?: boolean
  countNotifications?: number
  isOpenList: boolean
  onCloseList: () => void
  onToggleOpenList: () => void
}

export const DropDownButton: FC<IDropDownButton> = ({
  icon,
  list,
  isActive,
  arrow = true,
  countNotifications,
  isOpenList,
  onCloseList,
  onToggleOpenList
}) => {
  const dropDownListEventRef = useRef(null)
  useOutside(dropDownListEventRef, onCloseList)

  const currentList =
    determineArray(list)
      ? list.map((el) => {
        if (el.url) {
          return (
            <NavLink
              key={el.url}
              to={el.url}
              title="Profile"
              activeClassName={styles.active}
              onClick={onCloseList}
            >
              <div className={styles.icon}>
                {el.icon}
              </div>
              {el.title}
            </NavLink>
          )
        }
        return (
          <div
            onClick={() => {
              if (el.onClick) el.onClick()
              if (el.title !== 'Share') onCloseList()
            }}
            key={el.url}
          >
            <div className={styles.icon}>
              {el.isLoading ? <PreloaderIcon stroke="#ccd5e4" /> : el.icon}
            </div>
            {el.title}
          </div>
        )
      })
      : list

  return (
    <div className={styles.container} ref={dropDownListEventRef}>
      <div
        className={cn(
          styles.button,
          isOpenList && styles.openDropDownList,
          isActive && styles.active
        )}
        onClick={onToggleOpenList}
      >
        {icon}
        {arrow && <div className={styles.arrow}><ArrowBottomIcon /></div>}
        {countNotifications && <CounterNotifications count={countNotifications} left={-25} />}
      </div>
      {isOpenList && (
        <div className={styles.dropDownContainer}>
          {currentList}
        </div>
      )}
    </div>
  )
}
