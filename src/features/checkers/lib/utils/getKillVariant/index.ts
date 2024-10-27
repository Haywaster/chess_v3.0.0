import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'

import { boardCellsIds } from '../../../const'
import type { IBoard, IKillVariant } from '../../../model'
import { calcFigureKill, calcStainKill } from '../calcKill'

const getKillVariant = (
  activeFigure: IFigure,
  cell: ICell,
  board: IBoard
): IKillVariant | undefined => {
  const { figures, cells } = board

  const isEnemyFigure =
    cell.figureId && figures[cell.figureId].color !== activeFigure.color
  const isBorderCandidate = boardCellsIds.includes(cell.id)

  if (!isEnemyFigure || isBorderCandidate) {
    return
  }

  return !activeFigure.isStain
    ? calcFigureKill(cells, activeFigure, cell)
    : calcStainKill(cells, activeFigure, cell)
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
