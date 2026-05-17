import type { GameMode, GameStatus, GameType } from './const'

// shared
export type EnumValues<
  T extends Record<string, string | number> | ReadonlyArray<string | number>
> = T extends ReadonlyArray<string | number> ? T[number] : T[keyof T]

export type TGameType = EnumValues<typeof GameType>
export type TGameMode = EnumValues<typeof GameMode>
export type TGameStatus = EnumValues<typeof GameStatus>

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
