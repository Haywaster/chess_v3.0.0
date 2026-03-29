import { type FC } from 'react'

import { useOnline, useUsername } from 'entities/User'
import { LogoutButton } from 'features/auth/logout'
import { SwitchButton } from 'features/switchTheme'

import { HeaderWrapper } from './HeaderWrapper'

export const MainHeader: FC = () => {
  const username = useUsername()
  const online = useOnline()

  return (
    <HeaderWrapper>
      <SwitchButton />
      <h2>Haywaster's games</h2>
      {username && <LogoutButton />}
      {!online && <p>You are offline, functionality may be limited</p>}
    </HeaderWrapper>
  )
}
