import type { IFigure } from 'entities/Figure'
import type {
  EnumValues,
  WebsocketDataConstructor,
  WebsocketErrorConstructor
} from 'shared/types'

import type { GameType, GameStatus, ActionType, GameMode } from '../const'

export type TGameType = EnumValues<typeof GameType>
export type TGameMode = EnumValues<typeof GameMode>
export type TGameStatus = EnumValues<typeof GameStatus>

export interface IBaseGame {
  id: string
  status: TGameStatus
}

interface ICheckersUserData {
  color: IFigure['color']
}

interface ICheckersGameData {
  currentTurn: IFigure['color']
}

interface ICheckersGame extends IBaseGame {
  type: typeof GameType.CHECKERS
  userData: ICheckersUserData
  gameData: ICheckersGameData
}

export type IGame = ICheckersGame

export interface ICreateGameData {
  type: TGameType
  gameData: {
    rules: Record<string, boolean>
    color: IFigure['color']
  }
}

export interface IJoinGameData {
  username: string
  game: Omit<IGame, 'status' | 'userData' | 'gameData'>
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
