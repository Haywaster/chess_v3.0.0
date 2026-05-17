export const CheckersActionType = {
  JOIN_GAME: 'JOIN_GAME',
  MOVE_FIGURE: 'MOVE_FIGURE',
  KILL_FIGURE: 'KILL_FIGURE',
  ERROR: 'ERROR'
} as const

export const CheckersRules = {
  behindKill: 'BEHIND_KILL',
  killMaxFigure: 'KILL_MAX_FIGURE',
  requireKill: 'REQUIRE_KILL',
  stopAfterKill: 'STOP_AFTER_KILL'
} as const

export const BOARD_SIZE = 8
export const EVEN_NUMBER = 2
export const DOUBLE = 2
