import { type FC, memo, type MouseEventHandler, useState } from 'react'

import { useUsername } from 'entities/User'
import { LoginForm } from 'features/auth/login'
import { VideoLinks } from 'features/chooseVideoLink'
import { RouterPath } from 'shared/const/router'
import { type TRouterPath } from 'shared/types'
import { Flex } from 'shared/ui'

import { games } from '../../const'
import { WelcomeModal } from '../WelcomeModal'

const RADIX = 16
const SLICE = 2

const uniqGameId = Math.random().toString(RADIX).slice(SLICE)

interface IProps {
  onError: () => void
}

export const ChooseGame: FC<IProps> = memo(props => {
  const { onError } = props

  const globalUsername = useUsername()

  const [modalLink, setModalLink] = useState<TRouterPath | null>(null)

  const gameClickHandler: MouseEventHandler<HTMLAnchorElement> = e => {
    if (globalUsername === '') {
      e.preventDefault()
      onError()
      return
    }
    const candidateLink = e.currentTarget.pathname as TRouterPath
    setModalLink(candidateLink)
    e.preventDefault()
  }

  const closeModal = (): void => setModalLink(null)
  const uniqueGameLink = modalLink
    ? `${modalLink}/${uniqGameId}`
    : RouterPath.Home
  const game = games.find(game => game.route === modalLink)?.title

  return (
    <Flex direction="column">
      <LoginForm />
      <VideoLinks videoLinks={games} onClick={gameClickHandler} />
      <WelcomeModal
        game={game}
        isOpen={!!modalLink}
        uniqueGameLink={uniqueGameLink}
        username={globalUsername}
        onClose={closeModal}
      />
    </Flex>
  )
})
