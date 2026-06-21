import { type FC, memo, useState } from 'react'
import { useNavigate } from 'react-router'

import {
  GameMode,
  gameService,
  GameType,
  type ICreateGameData,
  type TGameType
} from 'entities/Game'
import { useOnline, useUsername } from 'features/auth'
import { CheckersChooseRules } from 'features/checkers'
import { VideoLinks } from 'features/chooseVideoLink'
import { Flex, Modal } from 'shared/ui'

import { games } from '../../const'

export const ChooseGame: FC = memo(() => {
  const online = useOnline()
  const username = useUsername()
  const navigate = useNavigate()

  const [gameType, setGameType] = useState<TGameType | null>(null)

  const chooseGame = (type: TGameType): void => {
    setGameType(type)
  }

  const closeModal = (): void => {
    setGameType(null)
  }

  const createGame = async (data: ICreateGameData): Promise<void> => {
    if (data.mode === GameMode.OFFLINE) {
      navigate(`/${data.type.toLowerCase()}/offline-game`)
    } else {
      const { data: gameId } = await gameService.createGame(data)
      navigate(`/${data.type.toLowerCase()}/${gameId}`)
    }
  }

  return (
    <Flex direction="column">
      <VideoLinks videoLinks={games} onClick={chooseGame} />
      <Modal isOpen={!!gameType} onClose={closeModal}>
        <p>
          <b>Hello{username ? `, ${username}` : ''}! </b>
          Do you really want to play <b>{gameType}</b>?
        </p>
        {gameType === GameType.CHECKERS && (
          <CheckersChooseRules createGame={createGame} online={online} />
        )}
      </Modal>
    </Flex>
  )
})
