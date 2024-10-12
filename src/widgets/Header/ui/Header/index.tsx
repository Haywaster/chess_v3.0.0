import { memo, type FC } from 'react'

import { useSwitchTheme } from 'features/switchTheme'
import { Button } from 'shared/ui/Button'

export const Header: FC = memo(() => {
  const toggleTheme = useSwitchTheme()

  return (
    <header>
      <Button onClick={toggleTheme}>Switch theme</Button>
    </header>
  )
})
