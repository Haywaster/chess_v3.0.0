import { type TimeUnits } from 'shared/types'

export const EVEN_NUMBER = 2
export const DOUBLE = 2
export const TRANSLATE_PCT = 50
export const BOARD_SIZE = 8
export const CHAR_CODE = 97

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
