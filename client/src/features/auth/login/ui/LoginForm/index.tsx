import {
  type ChangeEventHandler,
  type FC,
  type FormEventHandler,
  useState
} from 'react'
import styled from 'styled-components'

import { useUsername, useSetUsername } from 'entities/User'
import { DoneIcon } from 'shared/assets'
import { useWs } from 'shared/store'
import { Button, Flex, Input } from 'shared/ui'

import { type AuthRequestWebsocket } from '../../model'

const StyledForm = styled.form<{ $hidden: boolean }>`
  visibility: ${props => (props.$hidden ? 'hidden' : 'visible')};
`

export const LoginForm: FC = () => {
  const ws = useWs()
  const globalUsername = useUsername()
  const setGlobalUsername = useSetUsername()

  const [localUsername, setLocalUserName] = useState<string>('')

  const submitHandler: FormEventHandler<HTMLFormElement> = (e): void => {
    e.preventDefault()

    if (!globalUsername) {
      const username = localUsername.trim()
      setGlobalUsername(username)
      setLocalUserName('')

      //TODO: Отправлять запрос на регистрацию.
      const requestObj: AuthRequestWebsocket = {
        type: 'auth',
        data: { username }
      }
      ws?.send(JSON.stringify(requestObj))
      // ws?.addEventListener('message', (event: MessageEvent<AuthRequestWebsocket>) => {
      //   console.log(event.data)
      // })
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
