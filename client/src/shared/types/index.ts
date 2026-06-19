import type { EnumValues } from '@game-workspace/shared'

import type { WebSocketStatus } from 'shared/const/statuses'
import type { Themes } from 'shared/const/themes'
export type Size = 'lg' | 'sm' | 'xs'

export type TWebSocketStatus = EnumValues<typeof WebSocketStatus>
export type Theme = EnumValues<typeof Themes>
export type {
  WebsocketDataConstructor,
  WebsocketErrorConstructor
} from '@game-workspace/shared'
export type { EnumValues }
