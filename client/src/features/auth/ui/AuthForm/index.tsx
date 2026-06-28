import { isAxiosError } from 'axios'
import { type FC, type SubmitEventHandler, useRef, useState } from 'react'
import styled from 'styled-components'

import { CrossIcon, DoneIcon } from 'shared/assets'
import { Button, Flex, Input } from 'shared/ui'

import { useLoginUser, useRegistrationUser } from '../../lib'
import { type TAuthErrors } from '../../model'
import { useIsAuth } from '../../store'

const StyledForm = styled.form<{ $hidden: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  visibility: ${props => (props.$hidden ? 'hidden' : 'visible')};
`

const errorLabels: Record<TAuthErrors, string> = {
  USER_NOT_FOUND: 'No user with this data was found. Register him?',
  WRONG_PASSWORD: "The user's password is incorrect"
}

interface IProps {
  afterSuccess?: () => void
}

export const AuthForm: FC<IProps> = ({ afterSuccess }) => {
  const isAuth = useIsAuth()
  const [errorType, setErrorType] = useState<TAuthErrors | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)

  const login = useLoginUser()
  const registration = useRegistrationUser()

  const isRegistrationError = errorType === 'USER_NOT_FOUND'

  const submitHandler: SubmitEventHandler<HTMLFormElement> = e => {
    try {
      e.preventDefault()

      const formData = new FormData(e.target as HTMLFormElement)
      const userName = (formData.get('username') as string).trim()
      const password = (formData.get('password') as string).trim()

      if (!userName || !password) {
        return
      }

      if (isRegistrationError) {
        registration(userName, password)
        return
      }

      login(userName, password).catch(error => {
        if (
          isAxiosError<{
            message: string
            type: TAuthErrors
            errors: string[]
          }>(error) &&
          error.response?.data.type
        ) {
          setErrorType(error.response.data.type)
        }
      })
    } finally {
      afterSuccess?.()
    }
  }

  return (
    <>
      {errorType && (
        <p style={{ color: !isRegistrationError ? '#ff7990' : undefined }}>
          {errorLabels[errorType]}
        </p>
      )}
      <StyledForm
        ref={formRef}
        $hidden={isAuth}
        autoComplete="off"
        onSubmit={submitHandler}
      >
        <Input
          disabled={isRegistrationError}
          name="username"
          placeholder="Username"
        />
        <Flex>
          <Input
            disabled={isRegistrationError}
            name="password"
            placeholder="Password"
            type="password"
          />
          {isRegistrationError && (
            <Button
              icon
              mode="white"
              size="sm"
              onClick={() => setErrorType(null)}
            >
              <CrossIcon />
            </Button>
          )}
          <Button
            icon
            mode={errorType ? 'primary' : 'white'}
            size="sm"
            type="submit"
          >
            <DoneIcon />
          </Button>
        </Flex>
      </StyledForm>
    </>
  )
}
