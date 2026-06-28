import { type CSSProperties } from 'react'

import type {
  EnumValues,
  IGeneralGame,
  TGameMode,
  TGameType,
  WebsocketDataConstructor,
  WebsocketErrorConstructor
} from '@game-workspace/shared'

import type { CheckersActionType, CheckersRules } from './const'

// Базовые сущности board games
export interface ICell {
  id: number
  x: number
  y: number
  color: 'white' | 'black'
  figureId: IFigure['id'] | null
}

export interface IFigure {
  id: number
  x: number
  y: number
  color: 'white' | 'black'
  isStain: boolean
  cellId: ICell['id']
}

export interface IBoard {
  cells: Record<number, ICell>
  figures: Record<number, IFigure>
}

export interface IKillVariant {
  finishCellId: ICell['id']
  figure: IFigure['id']
}

// Типы board games
export type TCheckersActions = EnumValues<typeof CheckersActionType>
export type TCheckersRules = EnumValues<typeof CheckersRules>

// REST (Create)
export interface ICreateGameData {
  type: TGameType
  mode: TGameMode
  rules: Record<string, boolean>
  userColor: IFigure['color']
}

// WS (Info)
type IGameInfoRequest = Pick<IGeneralGame, 'id'>
type IGameInfoResponse = Pick<IGeneralGame, 'mode'>

export type GameInfoRequestWebsocket = WebsocketDataConstructor<
  Extract<TCheckersActions, 'GAME_INFO'>,
  IGameInfoRequest
>
export type GameInfoResponseWebsocket = WebsocketDataConstructor<
  Extract<TCheckersActions, 'GAME_INFO'>,
  IGameInfoResponse
>

// WS (Join)
interface IJoinGameRequest extends Pick<IGeneralGame, 'id'> {
  username: string
}
interface IJoinGameResponse extends Pick<IGeneralGame, 'status'> {
  board: IBoard
  userColor: IFigure['color']
  currentTurn: IFigure['color']
  message?: string
}
export type JoinGameRequestWebsocket = WebsocketDataConstructor<
  Extract<TCheckersActions, 'JOIN_GAME'>,
  IJoinGameRequest
>
export type JoinGameResponseWebsocket = WebsocketDataConstructor<
  Extract<TCheckersActions, 'JOIN_GAME'>,
  IJoinGameResponse
>

// WS (Move)
export interface IMoveFigure {
  startCell: ICell
  finishCell: ICell
}
interface IMoveFigureResponse extends IMoveFigure {
  currentTurn: IFigure['color']
}
export type MoveFigureRequestWebsocket = WebsocketDataConstructor<
  Extract<TCheckersActions, 'MOVE_FIGURE'>,
  IMoveFigure
>
export type MoveFigureResponseWebsocket = WebsocketDataConstructor<
  Extract<TCheckersActions, 'MOVE_FIGURE'>,
  IMoveFigureResponse
>

// WS (Kill)
export interface IKillFigure extends IMoveFigure {
  figureId: IFigure['id']
}
interface IKillFigureResponse extends IKillFigure {
  currentTurn: IFigure['color']
}
export type KillFigureRequestWebsocket = WebsocketDataConstructor<
  Extract<TCheckersActions, 'KILL_FIGURE'>,
  IKillFigure
>
export type KillFigureResponseWebsocket = WebsocketDataConstructor<
  Extract<TCheckersActions, 'KILL_FIGURE'>,
  IKillFigureResponse
>

// WS (Message)
interface IMessageResponse {
  type: 'error' | 'success'
  message: string
  options?: {
    id: string
    toasterId?: string
    icon?: string
    duration?: number
    pauseDuration: number
    position?: string
    removeDelay?: number
    ariaProps: {
      role: 'status' | 'alert'
      'aria-live': 'assertive' | 'off' | 'polite'
    }
    style?: CSSProperties
    className?: string
    createdAt: number
    visible: boolean
    dismissed: boolean
    height?: number
  }
}
export type MessageResponseWebsocket = WebsocketDataConstructor<
  Extract<TCheckersActions, 'MESSAGE'>,
  IMessageResponse
>

// WS (Error)
export type ErrorResponseWebsocket = WebsocketErrorConstructor<
  Extract<TCheckersActions, 'ERROR'>,
  string
>
