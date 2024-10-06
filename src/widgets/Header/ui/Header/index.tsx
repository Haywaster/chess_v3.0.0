import type { FC } from 'react'
import { Button } from 'shared/ui/Button'
import { useSwitchTheme } from 'features/switchTheme/lib/useSwitchTheme'

export const Header: FC = () => {
  const toggleTheme = useSwitchTheme()

  return (
    <header>
      <Button onClick={toggleTheme}>Switch theme</Button>
    </header>
  )
}
