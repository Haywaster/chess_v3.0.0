import { ActionType } from 'entities/Game'
import { BOARD_SIZE } from 'shared/const/numbers'

import { createBoard } from '../../lib'
import { type TRules } from '../types'

export const RENDER_DURATION = 50

export const initialCells = createBoard()

const borders = [1, BOARD_SIZE]
export const boardCellsIds = Object.values(initialCells.cells)
  .filter(cell => borders.includes(cell.x) || borders.includes(cell.y))
  .map(cell => cell.id)

export const Rules = {
  behindKill: 'BEHIND_KILL',
  killMaxFigure: 'KILL_MAX_FIGURE',
  requireKill: 'REQUIRE_KILL',
  stopAfterKill: 'STOP_AFTER_KILL'
} as const

export const ruleTitles: Record<TRules, string> = {
  [Rules.behindKill]: 'Рубить назад',
  [Rules.killMaxFigure]: 'Рубить фигуры по-максимуму',
  [Rules.requireKill]: 'Рубить обязательно',
  [Rules.stopAfterKill]: 'Остановить дамку после срубленной фигуры'
}

export const ruleDefaults = {
  [Rules.behindKill]: true,
  [Rules.killMaxFigure]: false,
  [Rules.requireKill]: true,
  [Rules.stopAfterKill]: false
} as const

export const CheckersActionType = {
  ...ActionType,
  MOVE_FIGURE: 'MOVE_FIGURE',
  KILL_FIGURE: 'KILL_FIGURE',
  SAVE_GAME: 'SAVE_GAME'
} as const
