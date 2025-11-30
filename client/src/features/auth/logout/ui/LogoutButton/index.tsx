import type { ComponentProps, FC, MouseEventHandler } from 'react'

import { useLogoutUser } from 'entities/User'
import { Button } from 'shared/ui'

import { LogoutIcon } from '../assets'

type IProps = ComponentProps<typeof Button>

export const LogoutButton: FC<IProps> = props => {
  const logout = useLogoutUser()

  const logoutHandler: MouseEventHandler<HTMLButtonElement> = () => {
    logout()
  }

  return (
    <Button icon mode="white" size="sm" onClick={logoutHandler} {...props}>
      <LogoutIcon />
    </Button>
  )
}
