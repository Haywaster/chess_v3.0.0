import { type ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'
import { DOUBLE } from 'shared/const/numbers'

import type { IBoard, IKillVariant } from '../../../model'
import { boardCellsIds } from '../../utils'

const getKillVariant = (
  activeFigure: IFigure,
  cell: ICell,
  board: IBoard
): IKillVariant | undefined => {
  const { figures, cells } = board

  const isEnemyFigure =
    Math.abs(cell.x - activeFigure.x) === 1 &&
    cell.figureId &&
    figures[cell.figureId].color !== activeFigure.color
  const isCandidateNotBoard = isEnemyFigure && !boardCellsIds.includes(cell.id)

  if (isCandidateNotBoard) {
    const afterCellId = DOUBLE * cell.id - activeFigure.cellId
    const isAfterCellFree = !('figureId' in cells[afterCellId])

    if (isAfterCellFree) {
      return {
        figure: cell.figureId as IFigure['id'],
        finishCellId: cells[afterCellId].id
      }
    }
  }
}

export const getKillVariants = (
  activeFigure: IFigure,
  board: IBoard,
  cell: ICell,
  variants: IKillVariant[] = []
): IKillVariant[][] => {
  const { cells } = board

  const processVariant = (variant: IKillVariant): IKillVariant[][] => {
    const newCell: ICell = cells[variant.finishCellId]
    const pseudoActiveFigure: IFigure = {
      ...activeFigure,
      x: newCell.x,
      y: newCell.y,
      cellId: newCell.id
    }
    const newVariants: IKillVariant[] = [...variants, variant]

    return getKillVariants(pseudoActiveFigure, board, newCell, newVariants)
  }

  if (variants.length === 0) {
    const variant = getKillVariant(activeFigure, cell, board)

    if (!variant) {
      return []
    }

    return processVariant(variant)
  }

  const allVariants: IKillVariant[][] = [variants]

  Object.values(cells).forEach(cell => {
    const diagonalCondition =
      Math.abs(cell.x - activeFigure.x) === Math.abs(cell.y - activeFigure.y)

    if (!diagonalCondition) {
      return
    }

    const variant = getKillVariant(activeFigure, cell, board)

    if (variant && !variants.some(item => item.figure === variant.figure)) {
      const newVariants = processVariant(variant)
      newVariants.forEach(v => allVariants.push(v))
    }
  })

  return allVariants
}
