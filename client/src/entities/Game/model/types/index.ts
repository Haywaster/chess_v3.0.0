import { type RouterPath } from 'shared/const/router'
import { type EnumValues, type WebsocketDataConstructor } from 'shared/types'

import { type GameType } from '../const'
export type GameStatus = 'pending' | 'playing' | 'finished'

export interface IGameIntroduction {
  title: string
  route: RouterPath
}

export interface IGame {
  id: string
  type: EnumValues<typeof GameType>
  status: GameStatus
}

export interface ICreateGameData {
  username: string
  game: Omit<IGame, 'status'>
}

export type CreateGameRequestWebsocket = WebsocketDataConstructor<
  'createGame',
  ICreateGameData
>
export type CreateGameResponseWebsocket = WebsocketDataConstructor<
  'createGame',
  IGame
>
