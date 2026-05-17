import { CheckersRules as Rules } from '@game-workspace/checkers'

import { ActionType } from 'entities/Game'

import type { TRules } from '../types'

const RENDER_DURATION = 50

const ruleTitles: Record<TRules, string> = {
  [Rules.behindKill]: 'Рубить назад',
  [Rules.killMaxFigure]: 'Рубить фигуры по-максимуму',
  [Rules.requireKill]: 'Рубить обязательно',
  [Rules.stopAfterKill]: 'Остановить дамку после срубленной фигуры'
}

const ruleDefaults = {
  [Rules.behindKill]: true,
  [Rules.killMaxFigure]: false,
  [Rules.requireKill]: true,
  [Rules.stopAfterKill]: false
} as const

const CheckersActionType = {
  ...ActionType,
  MOVE_FIGURE: 'MOVE_FIGURE',
  KILL_FIGURE: 'KILL_FIGURE'
} as const

export { RENDER_DURATION, Rules, ruleTitles, ruleDefaults, CheckersActionType }
export { initialCells, boardCellsIds } from '@game-workspace/checkers'
