import { isAxiosError } from 'axios'
import { type FC, type SubmitEventHandler, useRef, useState } from 'react'
import styled from 'styled-components'

import { DoneIcon } from 'shared/assets'
import { type EnumValues } from 'shared/types'
import { Button, Flex, Input } from 'shared/ui'

import { useLoginUser, useRegistrationUser } from '../../lib'
import { useIsAuth } from '../../store'
import { RegistrationModal } from '../RegistrationModal'

import type { authErrors } from '../../model'

const StyledForm = styled.form<{ $hidden: boolean }>`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  visibility: ${props => (props.$hidden ? 'hidden' : 'visible')};
`

export const LoginForm: FC = () => {
  const isAuth = useIsAuth()
  const [isOpenRegistrationModal, setIsOpenRegistrationModal] =
    useState<boolean>(false)
  const formRef = useRef<HTMLFormElement | null>(null)

  const login = useLoginUser()
  const registration = useRegistrationUser()

  const closeModal = (): void => setIsOpenRegistrationModal(false)

  const submitHandler: SubmitEventHandler<HTMLFormElement> = e => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const userName = (formData.get('username') as string).trim()
    const password = (formData.get('password') as string).trim()

    if (userName && password) {
      try {
        login(userName, password)
      } catch (error) {
        if (
          isAxiosError<{
            message: string
            type: EnumValues<typeof authErrors>
            errors: string[]
          }>(error)
        ) {
          switch (error.response?.data.type) {
            case 'USER_NOT_FOUND': {
              setIsOpenRegistrationModal(true)
            }
          }
        }
      }
    }
  }

  const registerHandler = async (): Promise<void> => {
    const password = formRef.current?.password.value
    const username = formRef.current?.username.value

    await registration(username, password)
  }

  return (
    <StyledForm
      ref={formRef}
      $hidden={isAuth}
      autoComplete="off"
      onSubmit={submitHandler}
    >
      <Input name="username" placeholder="Username" />
      <Flex>
        <Input name="password" placeholder="Password" type="password" />
        <Button icon mode="white" size="sm" type="submit">
          <DoneIcon />
        </Button>
      </Flex>
      <RegistrationModal
        isOpen={isOpenRegistrationModal}
        onClose={closeModal}
        onRegister={registerHandler}
      />
    </StyledForm>
  )
}
