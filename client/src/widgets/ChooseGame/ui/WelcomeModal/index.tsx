import type { ComponentProps, FC } from 'react'
import { Link } from 'react-router-dom'

import { type IGame } from 'entities/Game/model/types'
import { Button } from 'shared/ui/Button'
import { CopyButton } from 'shared/ui/CopyButton'
import { Flex } from 'shared/ui/Flex'
import { Modal } from 'shared/ui/Modal'

interface IProps extends ComponentProps<typeof Modal> {
  username: string
  uniqueGameLink: string
  game: IGame['title'] | undefined
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
