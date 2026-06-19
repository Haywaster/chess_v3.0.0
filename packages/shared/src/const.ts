import type { TimeUnits } from './types'

export const GameType = {
  CHECKERS: 'CHECKERS',
  CHESS: 'CHESS'
} as const

export const GameStatus = {
  PENDING: 'pending',
  PLAYING: 'playing',
  FINISHED: 'finished'
} as const

export const GameMode = {
  SINGLE: 'SINGLE',
  COUPLE: 'COUPLE',
  OFFLINE: 'OFFLINE'
} as const

export const StatusCodes = {
  SUCCESS: 200,
  CLIENT_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
} as const

// Time in ms
const MS = 1
const SECOND = 1000
const MINUTE = 60
const HOUR = 60
const DAY = 24

export const baseTimeInMs: Record<TimeUnits, number> = {
  MS,
  SECOND: SECOND * MS,
  MINUTE: MINUTE * SECOND * MS,
  HOUR: HOUR * MINUTE * SECOND * MS,
  DAY: DAY * HOUR * MINUTE * SECOND * MS
}
