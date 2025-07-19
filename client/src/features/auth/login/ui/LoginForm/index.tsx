import {
  type ChangeEventHandler,
  type FC,
  type FormEventHandler,
  useState
} from 'react'
import styled from 'styled-components'

import { useUsername, useSetUsername } from 'entities/User'
import { DoneIcon } from 'shared/assets'
import { Button, Flex, Input } from 'shared/ui'

const StyledForm = styled.form<{ $hidden: boolean }>`
  visibility: ${props => (props.$hidden ? 'hidden' : 'visible')};
`

export const LoginForm: FC = () => {
  const globalUsername = useUsername()
  const setGlobalUsername = useSetUsername()

  const [localUsername, setLocalUserName] = useState<string>('')

  const submitHandler: FormEventHandler<HTMLFormElement> = (e): void => {
    e.preventDefault()

    if (!globalUsername) {
      const username = localUsername.trim()
      setLocalUserName('')
      setGlobalUsername(username)
    }
  }

  const inputChangeHandler: ChangeEventHandler<HTMLInputElement> = e => {
    setLocalUserName(e.target.value)
  }

  return (
    <StyledForm $hidden={!!globalUsername} onSubmit={submitHandler}>
      <Flex size="sm">
        <Input
          placeholder="Your name"
          value={localUsername}
          onChange={inputChangeHandler}
        />
        {localUsername && (
          <Button icon mode="white" size="sm" type="submit">
            <DoneIcon />
          </Button>
        )}
      </Flex>
    </StyledForm>
  )
}
