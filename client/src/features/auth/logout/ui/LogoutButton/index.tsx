import type { ComponentProps, FC, MouseEventHandler } from 'react'

import { useSetUsername } from 'entities/User'
import { Button } from 'shared/ui'

import { LogoutIcon } from '../assets'

type IProps = ComponentProps<typeof Button>

export const LogoutButton: FC<IProps> = props => {
  const { onClick, ...rest } = props
  const setUsername = useSetUsername()

  const logoutHandler: MouseEventHandler<HTMLButtonElement> = (e): void => {
    //TODO: Удалять токен, а не username
    setUsername('')

    if (onClick) {
      onClick(e)
    }
  }

  return (
    <Button icon mode="white" size="sm" onClick={logoutHandler} {...rest}>
      <LogoutIcon />
    </Button>
  )
}
