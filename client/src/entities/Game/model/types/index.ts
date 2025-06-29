import { type RouterPath } from 'shared/const/router'
import { type WebsocketDataConstructor } from 'shared/types'

export type GameStatus = 'pending' | 'playing' | 'finished'
export type GameType = 'checkers' | 'chess'

export interface IGameIntroduction {
  title: string
  route: RouterPath
}

export interface IGame {
  id: string
  type: GameType
  status: GameStatus
}

interface ICreateGameData {
  username: string
  game: Omit<IGame, 'status'>
}

export type CreateGameRequestWebsocket = WebsocketDataConstructor<'createGame', ICreateGameData>
