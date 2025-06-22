import { type RouterPath } from 'shared/const/router'

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

export interface ICreateGameRequest {
  type: 'createGame'
  username: string
  game: Omit<IGame, 'status'>
}
