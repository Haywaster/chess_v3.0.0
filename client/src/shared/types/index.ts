import type { RouterPath } from 'shared/const/router'
import type { WebSocketStatus } from 'shared/const/ws'

export type EnumValues<T extends Record<string, string | number>> = T[keyof T]
export type Size = 'lg' | 'sm' | 'xs'
export interface WebsocketDataConstructor<
  T = string,
  D = Record<string, unknown>
> {
  type: T
  data: D
}
export type MessageListener = <T, D>(
  message: WebsocketDataConstructor<T, D>
) => void
export type TWebSocketStatus = EnumValues<typeof WebSocketStatus>
export type TRouterPath = EnumValues<typeof RouterPath>
