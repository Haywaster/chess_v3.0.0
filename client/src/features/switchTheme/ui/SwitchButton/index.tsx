import { type FC } from 'react'

import { useTheme } from 'shared/store'
import { Button } from 'shared/ui/Button'

import { Sun, Moon } from '../../assets'
import { useSwitchTheme } from '../../lib'

export const SwitchButton: FC = () => {
  const theme = useTheme()
  const toggleTheme = useSwitchTheme()

  const icon = theme === 'light' ? <Sun /> : <Moon />

  return (
    <Button icon mode="white" size="sm" onClick={toggleTheme}>
      {icon}
    </Button>
  )
}
