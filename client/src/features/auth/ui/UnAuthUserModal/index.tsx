import { type FC } from 'react'

import { Modal } from 'shared/ui'
import { type ModalProps } from 'shared/ui/Modal'

import { useIsAuth, useOnline } from '../../store'

interface IProps extends ModalProps {
  isOpen: boolean
}

// Модальное окно для неавторизованных пользователей
export const UnAuthUserModal: FC<IProps> = props => {
  const { isOpen: isOpenProps, ...rest } = props
  const isAuth = useIsAuth()
  const online = useOnline()

  const isOpen = !isAuth && online && isOpenProps

  return <Modal isOpen={isOpen} {...rest} />
}
