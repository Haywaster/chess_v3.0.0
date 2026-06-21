import { Button } from 'shared/ui'

import { DoorIcon } from '../../assets'
import { useLogoutUser } from '../../lib'

import type { ComponentProps, FC } from 'react'

type IProps = ComponentProps<typeof Button>

export const LogoutButton: FC<IProps> = props => {
  const logout = useLogoutUser()

  const logoutHandler = (): void => {
    logout()
  }

  return (
    <Button icon mode="white" size="sm" onClick={logoutHandler} {...props}>
      <DoorIcon />
    </Button>
  )
}
