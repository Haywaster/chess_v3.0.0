import { type FC, memo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { gameService, type TGameType } from 'entities/Game'
import { useIsAuth, useUsername } from 'entities/User'
import { LoginForm } from 'features/auth/login'
import { VideoLinks } from 'features/chooseVideoLink'
import { Button, CopyButton, Flex, Modal } from 'shared/ui'

import { games } from '../../const'

interface IProps {
  onError: () => void
}

export const ChooseGame: FC<IProps> = memo(props => {
  const { onError } = props

  const isAuth = useIsAuth()
  const username = useUsername()
  const navigate = useNavigate()

  const [checkedGame, setCheckedGame] = useState<TGameType | null>(null)

  const gameClickHandler = (game: TGameType): void => {
    if (!isAuth) {
      onError()
    } else {
      setCheckedGame(game)
    }
  }

  const closeModal = (): void => setCheckedGame(null)
  const createGame = async (): Promise<void> => {
    if (checkedGame) {
      const { data: gameId } = await gameService.createGame(checkedGame)
      navigate(`/${checkedGame.toLowerCase()}/${gameId}`, { replace: true })
    }
  }

  return (
    <Flex direction="column">
      <LoginForm />
      <VideoLinks videoLinks={games} onClick={gameClickHandler} />
      <Modal isOpen={!!checkedGame} onClose={closeModal}>
        <h3>Hello, {username}!</h3>
        <p>
          Do you really want to play <b>{checkedGame}</b>?
        </p>
        <Flex>
          <Button size="sm" onClick={createGame}>
            Go!
          </Button>
          <CopyButton copy={checkedGame ?? ''} />
        </Flex>
      </Modal>
    </Flex>
  )
})
