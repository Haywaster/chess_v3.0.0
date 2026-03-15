import { type FC, memo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import {
  GameMode,
  gameService,
  GameType,
  type ICreateGameData,
  type TGameMode,
  type TGameType
} from 'entities/Game'
import { useIsAuth, useUsername } from 'entities/User'
import { LoginForm } from 'features/auth/login'
import { CheckersChooseRules } from 'features/checkers'
import { VideoLinks } from 'features/chooseVideoLink'
import { Flex, Modal } from 'shared/ui'

import { games } from '../../const'

interface IProps {
  onError: () => void
}

const InlineHeader = styled.h3`
  display: inline;
`

export const ChooseGame: FC<IProps> = memo(props => {
  const { onError } = props

  const isAuth = useIsAuth()
  const username = useUsername()
  const navigate = useNavigate()

  const [gameType, setGameType] = useState<TGameType | null>(null)

  const chooseGame = (type: TGameType): void => {
    // TODO: В планах сделать возможность играть без регистрации
    if (!isAuth) {
      onError()
    } else {
      setGameType(type)
    }
  }

  const closeModal = (): void => {
    setGameType(null)
  }

  const createGame = async ({
    type,
    gameData,
    mode
  }: ICreateGameData & { mode: TGameMode }): Promise<void> => {
    if (mode === GameMode.SINGLE) {
      navigate(`/${type.toLowerCase()}/single-game`, { replace: true })
    } else {
      const body: ICreateGameData = { type, gameData }
      const { data: gameId } = await gameService.createGame(body)
      navigate(`/${type.toLowerCase()}/${gameId}`, { replace: true })
    }
  }

  return (
    <Flex direction="column">
      <LoginForm />
      <VideoLinks videoLinks={games} onClick={chooseGame} />
      <Modal isOpen={!!gameType} onClose={closeModal}>
        <p>
          <InlineHeader>Hello, {username}! </InlineHeader>
          Do you really want to play <b>{gameType}</b>?
        </p>
        {gameType === GameType.CHECKERS && (
          <CheckersChooseRules createGame={createGame} />
        )}
      </Modal>
    </Flex>
  )
})
