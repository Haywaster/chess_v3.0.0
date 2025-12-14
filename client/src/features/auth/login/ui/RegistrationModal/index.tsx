import type { ComponentProps, FC } from 'react'

import { useRegistrationUser } from 'entities/User'
import { Button, Modal } from 'shared/ui'

interface IProps extends ComponentProps<typeof Modal> {
  username: string
  password: string
}

export const RegistrationModal: FC<IProps> = props => {
  const { username, password, ...modalProps } = props
  const registration = useRegistrationUser()

  const registrationHandler = async (): Promise<void> => {
    await registration(username, password)
  }

  return (
    <Modal {...modalProps}>
      <h3>Пользователь с такими данными не найден. Зарегистрировать его?</h3>
      <Button onClick={registrationHandler}>Зарегистрировать</Button>
    </Modal>
  )
}
