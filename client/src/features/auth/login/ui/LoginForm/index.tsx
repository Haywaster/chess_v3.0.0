import { isAxiosError } from 'axios'
import { type FC, type FormEvent, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { type authErrors, useIsAuth, useLoginUser } from 'entities/User'
import { DoneIcon } from 'shared/assets'
import { type EnumValues } from 'shared/types'
import { Button, Flex, Input } from 'shared/ui'

import { RegistrationModal } from '../RegistrationModal'

const StyledForm = styled.form<{ $hidden: boolean }>`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  visibility: ${props => (props.$hidden ? 'hidden' : 'visible')};
`

export const LoginForm: FC = () => {
  const formRef = useRef<HTMLFormElement>(null)
  const [isOpenRegistrationModal, setIsOpenRegistrationModal] =
    useState<boolean>(false)
  const isAuth = useIsAuth()
  const loginUser = useLoginUser()

  const closeModal = (): void => setIsOpenRegistrationModal(false)

  useEffect(() => {
    if (isAuth) {
      closeModal()
    }
  }, [isAuth])

  const submitHandler = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const userName = (formData.get('username') as string).trim()
    const password = (formData.get('password') as string).trim()

    if (userName && password) {
      try {
        await loginUser(userName, password)
      } catch (e) {
        if (
          isAxiosError<{
            message: string
            type: EnumValues<typeof authErrors>
            errors: string[]
          }>(e)
        ) {
          switch (e.response?.data.type) {
            case 'USER_NOT_FOUND': {
              setIsOpenRegistrationModal(true)
            }
          }
        }
      }
    }
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
        password={formRef.current?.password.value}
        username={formRef.current?.username.value}
        onClose={closeModal}
      />
    </StyledForm>
  )
}
