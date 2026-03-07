import type { IFigure } from 'entities/Figure'
import type {
  EnumValues,
  WebsocketDataConstructor,
  WebsocketErrorConstructor
} from 'shared/types'

import type { GameType, GameStatus, ActionType } from '../const'

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
  typeof ActionType.JOIN_GAME,
  IJoinGameData
>
export type JoinGameResponseWebsocket = WebsocketDataConstructor<
  typeof ActionType.JOIN_GAME,
  IGame
>
export type ErrorResponseWebsocket = WebsocketErrorConstructor<
  typeof ActionType.ERROR,
  string
>
