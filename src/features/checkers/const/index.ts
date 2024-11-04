import { type Rules } from 'features/checkers/model/types'
import { BOARD_SIZE } from 'shared/const/numbers'

import { createBoard } from '../lib'

export const RENDER_DURATION = 50

export const initialCells = createBoard()

const borders = [1, BOARD_SIZE]
export const boardCellsIds = Object.values(initialCells.cells)
  .filter(cell => borders.includes(cell.x) || borders.includes(cell.y))
  .map(cell => cell.id)

export const ruleTitles: Record<Rules, string> = {
  behindKill: 'Рубить назад',
  killMaxFigure: 'Рубить все доступные фигуры',
  requireKill: 'Рубить обязательно',
  stopAfterKill: 'Остановить дамку после срубленной фигуры'
}

export const ruleDefaults: Record<Rules, boolean> = {
  behindKill: true,
  killMaxFigure: false,
  requireKill: false,
  stopAfterKill: false
}
