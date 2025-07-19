import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import {
  type CreateGameRequestWebsocket,
  type CreateGameResponseWebsocket,
  type IGame,
  useGame,
  useSetGame
} from 'entities/Game'
import { useUsername } from 'entities/User'
import { WebSocketStatus } from 'shared/const/ws'
import { useInitialEffect, useWebSocketSubscription } from 'shared/lib'
import { useSendWsMessage, useWsStatus } from 'shared/store'

// Установка слежки за игрой
export const useGameInfo = (gameType: IGame['type']): void => {
  const game = useGame()
  const setGame = useSetGame()
  const sendMessage = useSendWsMessage()
  const wsStatus = useWsStatus()
  const username = useUsername()

  const { gameId } = useParams<'gameId'>()

  useInitialEffect(() => {
    if (!game && gameId) {
      const newGame: IGame = { type: gameType, id: gameId, status: 'pending' }
      setGame(newGame)
    }

    return () => setGame(null)
  })

  useWebSocketSubscription<CreateGameResponseWebsocket>(
    'createGame',
    newGameInfo => {
      if (game?.status === 'pending') {
        setGame(newGameInfo.data)
      }
    }
  )

  useEffect(() => {
    if (
      wsStatus === WebSocketStatus.OPEN &&
      game?.status === 'pending' &&
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
