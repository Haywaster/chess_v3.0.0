import { useCallback } from 'react'

import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'

import { useCheckers } from '../../../model'

const leftDiffCellId = 7
const rightDiffCellId = 9

interface UseActiveCells {
  (activeFigureId: IFigure['id']): ICell['id'][]
}

export const useCellsForMoving = (): UseActiveCells => {
  const cells = useCheckers(state => state.cells)
  const figures = useCheckers(state => state.figures)

  return useCallback(
    (activeFigureId: IFigure['id']): ICell['id'][] =>
      Object.values(cells)
        .filter(cell => {
          const activeFigure = figures[activeFigureId]
          const cellDifference = cell.id - activeFigure.cellId

          const isWhiteMoveValid =
            activeFigure.color === 'white' &&
            (cellDifference === leftDiffCellId ||
              cellDifference === rightDiffCellId)

          const isBlackMoveValid =
            activeFigure.color === 'black' &&
            (cellDifference === -leftDiffCellId ||
              cellDifference === -rightDiffCellId)

          const isColorMoveValid = isWhiteMoveValid || isBlackMoveValid

          const isDiagonalMoveValid =
            Math.abs(activeFigure.x - cell.x) ===
            Math.abs(activeFigure.y - cell.y)

          const isStainMoveValid =
            (!activeFigure.isStain && isColorMoveValid) || activeFigure.isStain

          return (
            cell.figureId === undefined &&
            isDiagonalMoveValid &&
            isStainMoveValid
          )
        })
        .map(cell => cell.id),
    [cells, figures]
  )
}
