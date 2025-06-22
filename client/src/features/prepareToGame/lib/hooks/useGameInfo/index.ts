import { useLocation } from 'react-router-dom'

import {
  type ICreateGameRequest,
  type GameType,
  type IGame,
  useGame,
  useSetGame
} from 'entities/Game'
import { useUsername } from 'entities/User'

export const useGameInfo = (): ICreateGameRequest | undefined => {
  const username = useUsername()
  const game = useGame()
  const setGame = useSetGame()

  const { pathname } = useLocation()

  if (!game) {
    const [type, id] = pathname.split('/').filter(Boolean)
    const newGame: IGame = { type: type as GameType, id, status: 'pending' }
    setGame(newGame)
    return { game: newGame, username, type: 'createGame' }
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,unused-imports/no-unused-vars
    const { status, ...gameWithoutStatus } = game

    return { game: gameWithoutStatus, username, type: 'createGame' }
  }
}
