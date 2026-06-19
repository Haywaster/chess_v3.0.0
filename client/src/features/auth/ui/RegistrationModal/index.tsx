import { Button, Modal } from 'shared/ui'

import type { ComponentProps, FC } from 'react'

interface IProps extends ComponentProps<typeof Modal> {
  onRegister: () => Promise<void>
}

export const RegistrationModal: FC<IProps> = props => {
  const { onRegister, ...modalProps } = props

  const registrationHandler = async (): Promise<void> => {
    onRegister().then(() => {
      modalProps.onClose?.()
    })
  }

  return (
    <Modal {...modalProps}>
      <h3>Пользователь с такими данными не найден. Зарегистрировать его?</h3>
      <Button onClick={registrationHandler}>Зарегистрировать</Button>
    </Modal>
  )
}
