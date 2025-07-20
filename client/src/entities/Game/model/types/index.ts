import type {
  EnumValues,
  TRouterPath,
  WebsocketDataConstructor
} from 'shared/types'

import type { GameType, GameStatus } from '../const'

export type TGameType = EnumValues<typeof GameType>
type TGameStatus = EnumValues<typeof GameStatus>

export interface IGameIntroduction {
  title: string
  route: TRouterPath
}

export interface IGame {
  id: string
  type: TGameType
  status: TGameStatus
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
