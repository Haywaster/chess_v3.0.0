import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'

export const calcFigureMove = (activeFigure: IFigure, cell: ICell): boolean => {
  const xDifference = cell.x - activeFigure.x
  const yDifference = cell.y - activeFigure.y

  const isWhiteMoveValid = activeFigure.color === 'white' && yDifference > 0
  const isBlackMoveValid = activeFigure.color === 'black' && yDifference < 0
  const isColorMoveValid = isWhiteMoveValid || isBlackMoveValid

  return isColorMoveValid && Math.abs(xDifference) === 1
}
