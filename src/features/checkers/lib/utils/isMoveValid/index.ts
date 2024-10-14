import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'

export const isMoveValid = (activeFigure: IFigure, cell: ICell): boolean => {
  const xDifference = cell.x - activeFigure.x
  const yDifference = cell.y - activeFigure.y

  const isWhiteMoveValid = activeFigure.color === 'white' && yDifference > 0
  const isBlackMoveValid = activeFigure.color === 'black' && yDifference < 0
  const isColorMoveValid = isWhiteMoveValid || isBlackMoveValid

  const isStainMoveValid =
    (!activeFigure.isStain && isColorMoveValid) || activeFigure.isStain

  return (
    cell.figureId === undefined &&
    isStainMoveValid &&
    Math.abs(xDifference) === 1
  )
}
