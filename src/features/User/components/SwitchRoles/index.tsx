import React, { FC } from 'react'
import cn from 'classnames'
import styles from './styles.module.sass'

interface ISwitchRoles {
  selectedRole: 'founder' | 'investor'
  setSelectedRole: (role: 'founder' | 'investor') => void
  roles: [
    'investor',
    'founder'
]
}

export const SwitchRoles: FC<ISwitchRoles> = ({ selectedRole, setSelectedRole, roles }) => (
  <div className={styles.container}>
    <div
      className={cn(
        styles.button,
        selectedRole === 'investor' && styles.active
      )}
      onClick={() => roles.includes('investor') && setSelectedRole('investor')}
    >
      investor
    </div>
    <div
      className={cn(
        styles.button,
        selectedRole === 'founder' && styles.active
      )}
      onClick={() => roles.includes('founder') && setSelectedRole('founder')}
    >
      founder
    </div>
  </div>
)
