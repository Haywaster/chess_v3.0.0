import { type WebSocketStatus } from 'shared/const/statuses'
import type { Themes } from 'shared/const/themes'

export type EnumValues<
  T extends Record<string, string | number> | ReadonlyArray<string | number>
> = T extends ReadonlyArray<string | number> ? T[number] : T[keyof T]

export type Size = 'lg' | 'sm' | 'xs'
export interface WebsocketConstructor<T = string> {
  type: T
}

export interface WebsocketDataConstructor<T, D = Record<string, unknown>>
  extends WebsocketConstructor<T> {
  data: D
}

export interface WebsocketErrorConstructor<T, D>
  extends WebsocketConstructor<T> {
  error: D
}
export type MessageListener = <T, D>(
  message: WebsocketDataConstructor<T, D>
) => void
export type TWebSocketStatus = EnumValues<typeof WebSocketStatus>
export type Theme = EnumValues<typeof Themes>
export type TimeUnits = 'MS' | 'SECOND' | 'MINUTE' | 'HOUR' | 'DAY'
