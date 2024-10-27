import { BOARD_SIZE } from 'shared/const/numbers'

import { createBoard } from '../lib'

export const RENDER_DURATION = 50

export const initialCells = createBoard()

const borders = [1, BOARD_SIZE]
export const boardCellsIds = Object.values(initialCells.cells)
  .filter(cell => borders.includes(cell.x) || borders.includes(cell.y))
  .map(cell => cell.id)
