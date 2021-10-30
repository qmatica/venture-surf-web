import React from 'react'
import { Input } from 'common/components/Input'
import styles from './styles.module.sass'

export const SignUp = () => {
  const onSubmit = (e: any) => {
    console.log(e)
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <Input name="email" placeholder="Type email" title="Email" />
        <Input name="password" placeholder="Type password" title="Password" />
      </form>
    </div>
  )
}
