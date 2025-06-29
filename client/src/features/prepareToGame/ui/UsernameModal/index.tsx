import { type FC, type FormEventHandler } from 'react'

import { useSetUsername, useUsername } from 'entities/User'
// import { useWs } from 'shared/store'
import { Button, Flex, Input, Modal } from 'shared/ui'

import { useGameInfo } from '../../lib'

export const UsernameModal: FC = () => {
  const gameInfo = useGameInfo()

  // const ws = useWs()
  const username = useUsername()
  const setUsername = useSetUsername()

  const submitHandler: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const username = formData.get('username')

    setUsername(username as string)

    // if (ws && gameInfo) {
    //   ws.send(JSON.stringify({ ...gameInfo, username }))
    // }
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
