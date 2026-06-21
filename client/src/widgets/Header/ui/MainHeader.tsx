import { type FC } from 'react'

import { useOnline, LogoutButton, useIsAuth, AuthButton } from 'features/auth'
import { SwitchButton } from 'features/switchTheme'

import { HeaderWrapper } from './HeaderWrapper'

export const MainHeader: FC = () => {
  const isAuth = useIsAuth()
  const online = useOnline()

  return (
    <HeaderWrapper>
      <SwitchButton />
      <h2>Haywaster's games</h2>
      {isAuth ? <LogoutButton /> : <AuthButton />}
      {!online && <p>You are offline, functionality may be limited</p>}
    </HeaderWrapper>
  )
}
