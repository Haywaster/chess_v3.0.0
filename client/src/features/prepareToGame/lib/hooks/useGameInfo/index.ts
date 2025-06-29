import { useLocation } from 'react-router-dom'

import {
  type CreateGameRequestWebsocket,
  type GameType,
  type IGame,
  useGame,
  useSetGame
} from 'entities/Game'
import { useUsername } from 'entities/User'

export const useGameInfo = (): CreateGameRequestWebsocket | undefined => {
  const username = useUsername()
  const game = useGame()
  const setGame = useSetGame()

  const { pathname } = useLocation()

  if (!game) {
    const [type, id] = pathname.split('/').filter(Boolean)
    const newGame: IGame = { type: type as GameType, id, status: 'pending' }
    const requestData: CreateGameRequestWebsocket['data'] = { username, game: newGame }
    setGame(newGame)
    return { type: 'createGame', data: requestData }
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,unused-imports/no-unused-vars
    const { status, ...gameWithoutStatus } = game
    const requestData: CreateGameRequestWebsocket['data'] = { username, game: gameWithoutStatus }
    return { type: 'createGame', data: requestData }
  }
}
