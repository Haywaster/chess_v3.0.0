export const GameType = {
  CHECKERS: 'CHECKERS',
  CHESS: 'CHESS'
} as const

export const GameStatus = {
  PENDING: 'pending',
  PLAYING: 'playing',
  FINISHED: 'finished'
} as const

export const ActionType = {
  JOIN_GAME: 'JOIN_GAME',
  ERROR: 'ERROR'
} as const
