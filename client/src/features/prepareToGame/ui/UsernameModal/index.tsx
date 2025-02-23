import { type FC, type FormEventHandler } from 'react'
import { useLocation } from 'react-router-dom'

import { useGame } from 'entities/Game/model/store/useGame.ts'
import { useWebsocket } from 'shared/api'
import { Button } from 'shared/ui/Button'
import { Flex } from 'shared/ui/Flex'
import { Input } from 'shared/ui/Input'
import { Modal } from 'shared/ui/Modal'

export const UsernameModal: FC = () => {
  const { pathname } = useLocation()
  const ws = useWebsocket(state => state.ws)
  const username = useGame(state => state.username)
  const setUsername = useGame(state => state.setUsername)

  const submitHandler: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const username = formData.get('username')

    setUsername(username as string)

    if (ws) {
      ws.send(JSON.stringify({ pathname, username }))
    }
  }

  return (
    <Modal isOpen={!username}>
      <form onSubmit={submitHandler}>
        <Flex align="center" direction="column">
          <h2>Enter your name to play</h2>
          <Input
            required
            name="username"
            placeholder="Your name"
            width="100%"
          />
          <Button type="submit">Confirm</Button>
        </Flex>
      </form>
    </Modal>
  )
}
