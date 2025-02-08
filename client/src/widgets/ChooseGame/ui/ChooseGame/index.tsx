import {
  type ChangeEventHandler,
  type FC,
  memo,
  type MouseEventHandler,
  useState
} from 'react'

import { VideoLinks } from 'features/chooseVideoLink'
import { RouterPath } from 'shared/const/router'
import { Flex } from 'shared/ui/Flex'
import { Input } from 'shared/ui/Input'

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

  const [username, setUsername] = useState<string>('')
  const [modalLink, setModalLink] = useState<RouterPath | null>(null)

  const inputChangeHandler: ChangeEventHandler<HTMLInputElement> = e => {
    setUsername(e.target.value)
  }

  const clickHandler: MouseEventHandler<HTMLAnchorElement> = (e): void => {
    if (username === '') {
      e.preventDefault()
      onError()
      return
    }
    const candidateLink = e.currentTarget.pathname as RouterPath
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
      <Input value={username} onChange={inputChangeHandler} />
      <VideoLinks videoLinks={games} onClick={clickHandler} />
      <WelcomeModal
        game={game}
        isOpen={!!modalLink}
        uniqueGameLink={uniqueGameLink}
        username={username}
        onClose={closeModal}
      />
    </Flex>
  )
})
