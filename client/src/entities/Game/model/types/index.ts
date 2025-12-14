import {
  type EnumValues,
  type WebsocketDataConstructor,
  type WebsocketErrorConstructor
} from 'shared/types'

import type { GameType, GameStatus } from '../const'

export type TGameType = EnumValues<typeof GameType>
type TGameStatus = EnumValues<typeof GameStatus>

export interface IGame {
  id: string
  type: TGameType
  status: TGameStatus
}

export interface IJoinGameData {
  username: string
  game: Omit<IGame, 'status'>
}

export type JoinGameRequestWebsocket = WebsocketDataConstructor<
  'JOIN_GAME',
  IJoinGameData
>
export type JoinGameResponseWebsocket = WebsocketDataConstructor<
  'JOIN_GAME',
  IGame
>
export type ErrorResponseWebsocket = WebsocketErrorConstructor<'ERROR', string>
