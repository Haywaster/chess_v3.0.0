import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import {
  type CreateGameRequestWebsocket,
  type CreateGameResponseWebsocket,
  type ICreateGameData,
  type TGameType,
  useSetGame
} from 'entities/Game'
import { useUsername } from 'entities/User'
import { type id } from 'shared/const/router.ts'
import { WebSocketStatus } from 'shared/const/statuses.ts'
import { useInitialEffect, useWebSocketSubscription } from 'shared/lib'
import { useSendWsMessage, useWsStatus } from 'shared/store'

// Установка слежки за игрой
export const useGameInfo = (gameType: TGameType): void => {
  const setGame = useSetGame()
  const sendMessage = useSendWsMessage()
  const wsStatus = useWsStatus()
  const username = useUsername()

  const { id: gameId } = useParams<typeof id>()

  useInitialEffect(() => () => setGame(null))

  useWebSocketSubscription<CreateGameResponseWebsocket>(
    'JOIN_GAME',
    newGameInfo => {
      setGame(newGameInfo.data)
    }
  )

  useEffect(() => {
    if (wsStatus === WebSocketStatus.OPEN && username && gameId) {
      const game: ICreateGameData['game'] = {
        type: gameType,
        id: gameId
      }
      const gameInfo: CreateGameRequestWebsocket = {
        type: 'JOIN_GAME',
        data: { username, game }
      }
      sendMessage(gameInfo)
    }
  }, [gameId, gameType, sendMessage, username, wsStatus])
}
