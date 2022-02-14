import React, { FC } from 'react'
import cn from 'classnames'
import styles from './styles.module.sass'

interface ISwitchRoles {
  selectedRole: 'founder' | 'investor'
  setSelectedRole: (role: 'founder' | 'investor') => void
  roles: ['investor', 'founder']
}

export const SwitchRoles: FC<ISwitchRoles> = ({
  selectedRole,
  setSelectedRole,
  roles
}) => (
  <div className={styles.container}>
    {roles?.includes('investor') && (
      <div
        className={cn(
          styles.button,
          selectedRole === 'investor' && styles.active
        )}
        onClick={() => setSelectedRole('investor')}
      >
        investor
      </div>
    )}
    {roles?.includes('founder') && (
      <div
        className={cn(styles.button, selectedRole === 'founder' && styles.active)}
        onClick={() => setSelectedRole('founder')}
      >
        founder
      </div>
    )}
  </div>
)
