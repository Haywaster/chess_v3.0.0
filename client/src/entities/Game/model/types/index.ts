import type { EnumValues, WebsocketDataConstructor } from 'shared/types'

import type { GameType, GameStatus } from '../const'

export type TGameType = EnumValues<typeof GameType>
type TGameStatus = EnumValues<typeof GameStatus>

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
  'JOIN_GAME',
  ICreateGameData
>
export type CreateGameResponseWebsocket = WebsocketDataConstructor<
  'JOIN_GAME',
  IGame
>
