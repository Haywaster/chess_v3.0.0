import { type FC } from 'react'

import { Button } from 'shared/ui/Button'

import { Sun, Moon } from '../../assets'
import { useSwitchTheme } from '../../lib'
import { useTheme } from '../../store'

export const SwitchButton: FC = () => {
  const theme = useTheme(state => state.theme)
  const toggleTheme = useSwitchTheme()

  const icon = theme === 'light' ? <Sun /> : <Moon />

  return (
    <Button icon mode="white" size="sm" onClick={toggleTheme}>
      {icon}
    </Button>
  )
}
