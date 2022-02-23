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
import { Dot } from 'common/components/Dot'
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
  isActiveNotify?: boolean
  listWidth?: number | 'unset'
}

export const DropDownButton: FC<IDropDownButton> = ({
  icon,
  list,
  isActive,
  arrow = true,
  countNotifications,
  isOpenList,
  onCloseList,
  onToggleOpenList,
  isActiveNotify,
  listWidth = 'unset'
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
              {el.isActiveNotify && <Dot top={-3} right={13} />}
            </div>
            {el.title}
          </div>
        )
      })
      : list

  return (
    <div className={styles.container} ref={dropDownListEventRef}>
      {isActiveNotify && <Dot top={12} right={24} />}
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
        <CounterNotifications count={countNotifications} left={-25} />
      </div>
      {isOpenList && (
        <div className={styles.dropDownContainer} style={{ width: listWidth }}>
          {currentList}
        </div>
      )}
    </div>
  )
}
