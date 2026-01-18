import type { IFigure } from 'entities/Figure'
import {
  type EnumValues,
  type WebsocketDataConstructor,
  type WebsocketErrorConstructor
} from 'shared/types'

import type { GameType, GameStatus } from '../const'

export type TGameType = EnumValues<typeof GameType>
type TGameStatus = EnumValues<typeof GameStatus>

interface IBaseGame {
  id: string
  status: TGameStatus
}

interface ICheckersUserData {
  color: IFigure['color']
}

interface ICheckersGame extends IBaseGame {
  type: typeof GameType.CHECKERS
  userData: ICheckersUserData
}

export type IGame = ICheckersGame

export interface IJoinGameData {
  username: string
  game: Omit<IGame, 'status' | 'userData'>
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
