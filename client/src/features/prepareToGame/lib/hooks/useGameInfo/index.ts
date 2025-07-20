import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import {
  type CreateGameRequestWebsocket,
  type CreateGameResponseWebsocket,
  GameStatus,
  type IGame,
  type TGameType,
  useGame,
  useSetGame
} from 'entities/Game'
import { useUsername } from 'entities/User'
import { type id } from 'shared/const/router'
import { WebSocketStatus } from 'shared/const/ws'
import { useInitialEffect, useWebSocketSubscription } from 'shared/lib'
import { useSendWsMessage, useWsStatus } from 'shared/store'

// Установка слежки за игрой
export const useGameInfo = (gameType: TGameType): void => {
  const game = useGame()
  const setGame = useSetGame()
  const sendMessage = useSendWsMessage()
  const wsStatus = useWsStatus()
  const username = useUsername()

  const { id: gameId } = useParams<typeof id>()

  useInitialEffect(() => {
    if (!game && gameId) {
      const newGame: IGame = {
        type: gameType,
        id: gameId,
        status: GameStatus.PENDING
      }
      setGame(newGame)
    }

    return () => setGame(null)
  })

  useWebSocketSubscription<CreateGameResponseWebsocket>(
    'createGame',
    newGameInfo => {
      if (game?.status === GameStatus.PENDING) {
        setGame(newGameInfo.data)
      }
    }
  )

  useEffect(() => {
    if (
      wsStatus === WebSocketStatus.OPEN &&
      game?.status === GameStatus.PENDING &&
      username
    ) {
      const gameInfo: CreateGameRequestWebsocket = {
        type: 'createGame',
        data: { game, username }
      }
      sendMessage(gameInfo)
    }
  }, [game, sendMessage, username, wsStatus])
}
