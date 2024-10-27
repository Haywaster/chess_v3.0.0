import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'

import type { IBoard } from '../../../model'

const isCellAfterFigure = (
  board: IBoard,
  activeFigure: IFigure,
  cell: ICell
): boolean => {
  const { cells, figures } = board
  const difference = activeFigure.x - cell.x // Показывает, как далеко расположена ячейка
  const idDifference = figures[activeFigure.id].cellId - cell.id
  const directionId = idDifference / Math.abs(difference)
  let isFigure = false

  for (let i = 1; i < Math.abs(difference); i++) {
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

const calcFigureMove = (activeFigure: IFigure, cell: ICell): boolean => {
  const xDifference = cell.x - activeFigure.x
  const yDifference = cell.y - activeFigure.y

  const isWhiteMoveValid = activeFigure.color === 'white' && yDifference > 0
  const isBlackMoveValid = activeFigure.color === 'black' && yDifference < 0
  const isColorMoveValid = isWhiteMoveValid || isBlackMoveValid

  return isColorMoveValid && Math.abs(xDifference) === 1
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
