import type { ComponentProps, FC } from 'react'
import { Link } from 'react-router-dom'

import { type IGameIntroduction } from 'entities/Game'
import { Button, CopyButton, Flex, Modal } from 'shared/ui'

interface IProps extends ComponentProps<typeof Modal> {
  username: string
  uniqueGameLink: string
  game: IGameIntroduction['title'] | undefined
}

export const WelcomeModal: FC<IProps> = props => {
  const { game, username, uniqueGameLink, ...rest } = props

  return (
    <Modal {...rest}>
      <h3>Hello, {username}!</h3>
      <p>
        Do you really want to play <b>{game}</b>?
      </p>
      <Flex>
        <Button as={Link} size="sm" to={uniqueGameLink}>
          Go!
        </Button>
        <CopyButton copy={uniqueGameLink} />
      </Flex>
    </Modal>
  )
}
