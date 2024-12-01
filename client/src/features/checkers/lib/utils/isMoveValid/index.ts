import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'

import type { IBoard } from '../../../model'
import { calcFigureMove } from '../calcFigureMove'

const isCellAfterFigure = (
  board: IBoard,
  activeFigure: IFigure,
  cell: ICell
): boolean => {
  const { cells, figures } = board
  const xDifference = activeFigure.x - cell.x // Показывает, как далеко расположена ячейка
  const idDifference = figures[activeFigure.id].cellId - cell.id
  const directionId = idDifference / Math.abs(xDifference)
  let isFigure = false

  for (let i = 1; i < Math.abs(xDifference); i++) {
    if ('figureId' in cells[activeFigure.cellId - i * directionId]) {
      isFigure = true
      break
    }
  }

  return isFigure
}

const calcStainMove = (
  board: IBoard,
  activeFigure: IFigure,
  cell: ICell
): boolean => {
  return !isCellAfterFigure(board, activeFigure, cell)
}

export const isMoveValid = (
  board: IBoard,
  activeFigure: IFigure,
  cell: ICell
): boolean => {
  const calculatedMove = !activeFigure.isStain
    ? calcFigureMove(activeFigure, cell)
    : calcStainMove(board, activeFigure, cell)

  return !('figureId' in cell) && calculatedMove
}
