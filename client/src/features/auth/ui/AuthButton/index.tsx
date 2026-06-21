import { type ComponentProps, type FC, useState } from 'react'
import styled from 'styled-components'

import { AuthForm, UnAuthUserModal } from 'features/auth'
import { Button, Flex } from 'shared/ui'

import { DoorIcon } from '../../assets'

type IProps = ComponentProps<typeof Button>

const Wrapper = styled(Flex)`
  text-align: center;
`

export const AuthButton: FC<IProps> = props => {
  const [isOpen, setIsOpen] = useState(false)

  const loginHandler = (): void => setIsOpen(true)
  const closeModal = (): void => setIsOpen(false)

  return (
    <>
      <Button icon mode="white" size="sm" onClick={loginHandler} {...props}>
        <DoorIcon style={{ rotate: '180deg' }} />
      </Button>
      <UnAuthUserModal
        destroyOnClose
        isOpen={isOpen}
        width={350}
        onClose={closeModal}
      >
        <Wrapper align="center" direction="column">
          <h3>Authorization</h3>
          <AuthForm />
        </Wrapper>
      </UnAuthUserModal>
    </>
  )
}
