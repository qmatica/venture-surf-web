import React from 'react'
import { useSelector } from 'react-redux'
import { getSurfUsers } from './selectors'
import styles from './styles.module.sass'

export const Surf = () => {
  const users = useSelector(getSurfUsers)
  return (
    <div>Surf</div>
  )
}
