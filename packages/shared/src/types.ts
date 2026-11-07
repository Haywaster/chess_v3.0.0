import type { GameMode, GameStatus, GameType, GameActionType } from './const'
import type { CSSProperties } from 'react'

// shared
export type EnumValues<
  T extends Record<string, string | number> | ReadonlyArray<string | number>
> = T extends ReadonlyArray<string | number> ? T[number] : T[keyof T]

export type TGameType = EnumValues<typeof GameType>
export type TGameMode = EnumValues<typeof GameMode>
export type TGameStatus = EnumValues<typeof GameStatus>
export type TGameActionType = EnumValues<typeof GameActionType>

export interface WebsocketConstructor<T = string> {
  type: T
}

export interface WebsocketDataConstructor<
  T,
  D = Record<string, unknown>
> extends WebsocketConstructor<T> {
  data: D
}

export interface WebsocketErrorConstructor<
  T,
  D
> extends WebsocketConstructor<T> {
  error: D
}

// Game
// Общий тип различных игр. Каждая игра имеет id, status, mode
export interface IGeneralGame {
  id: string
  status: TGameStatus
  mode: TGameMode
}

export type TimeUnits = 'MS' | 'SECOND' | 'MINUTE' | 'HOUR' | 'DAY'

// WS (Info)
type IGameInfoRequest = Pick<IGeneralGame, 'id'>
type IGameInfoResponse = Pick<IGeneralGame, 'mode'>

export type GameInfoRequestWebsocket = WebsocketDataConstructor<
  Extract<TGameActionType, 'GAME_INFO'>,
  IGameInfoRequest
>
export type GameInfoResponseWebsocket = WebsocketDataConstructor<
  Extract<TGameActionType, 'GAME_INFO'>,
  IGameInfoResponse
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
  Extract<TGameActionType, 'MESSAGE'>,
  IMessageResponse
>

// WS (Error)
export type ErrorResponseWebsocket = WebsocketErrorConstructor<
  Extract<TGameActionType, 'ERROR'>,
  string
>

// WS (Status)
type IChangeStatusResponse = Pick<IGeneralGame, 'status'>

export type ChangeStatusResponseWebsocket = WebsocketDataConstructor<
  Extract<TGameActionType, 'CHANGE_STATUS'>,
  IChangeStatusResponse
>
