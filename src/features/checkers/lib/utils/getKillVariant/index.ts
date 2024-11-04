import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'

import { boardCellsIds } from '../../../const'
import type { IBoard, IKillVariant, Rules } from '../../../model'
import {
  calcFigureKill,
  calcStainKillManyCells,
  calcStainKillSingleCell
} from '../calcKill'
import { makeFigureStain } from '../makeFigureStain'

const getKillVariant = (
  activeFigure: IFigure,
  cell: ICell,
  board: IBoard,
  rules: Record<Rules, boolean>
): IKillVariant | IKillVariant[] | undefined => {
  const { figures, cells } = board

  const isEnemyFigure =
    cell.figureId && figures[cell.figureId].color !== activeFigure.color
  const isBorderCandidate = boardCellsIds.includes(cell.id)

  if (!isEnemyFigure || isBorderCandidate) {
    return
  }

  return !activeFigure.isStain
    ? calcFigureKill(cells, activeFigure, cell)
    : rules.stopAfterKill
      ? calcStainKillSingleCell(cells, activeFigure, cell)
      : calcStainKillManyCells(cells, activeFigure, cell)
}

export const getKillVariants = (
  activeFigure: IFigure,
  board: IBoard,
  cell: ICell,
  rules: Record<Rules, boolean>,
  variants: IKillVariant[] = []
  // eslint-disable-next-line max-params
): IKillVariant[][] => {
  const { cells } = board
  const allVariants: IKillVariant[][] = variants.length === 0 ? [] : [variants]

  const processVariant = (variant: IKillVariant): IKillVariant[][] => {
    const newCell: ICell = cells[variant.finishCellId]

    const pseudoActiveFigure: IFigure = {
      ...activeFigure,
      isStain: makeFigureStain(activeFigure, newCell),
      x: newCell.x,
      y: newCell.y,
      cellId: newCell.id
    }
    const newVariants: IKillVariant[] = [...variants, variant]
    return getKillVariants(
      pseudoActiveFigure,
      board,
      newCell,
      rules,
      newVariants
    )
  }

  const processAndAddVariants = (variant: IKillVariant): void => {
    const newVariants = processVariant(variant)
    allVariants.push(...newVariants)
  }

  // Условие для самого первого поиска вариантов
  if (variants.length === 0) {
    const variant = getKillVariant(activeFigure, cell, board, rules)

    if (!variant) {
      return allVariants
    }

    if (!Array.isArray(variant)) {
      return processVariant(variant)
    }

    variant.forEach(processAndAddVariants)
    return allVariants
  }

  // Если найден первый вариант, придется искать новые по всей доске
  Object.values(cells).forEach(cell => {
    const diagonalCondition =
      Math.abs(cell.x - activeFigure.x) === Math.abs(cell.y - activeFigure.y)

    if (!diagonalCondition) {
      return
    }

    const variant = getKillVariant(activeFigure, cell, board, rules)

    if (!variant) {
      return allVariants
    }

    if (!Array.isArray(variant)) {
      if (!variants.some(item => item.figure === variant.figure)) {
        return processAndAddVariants(variant)
      }
    } else {
      if (!variants.some(item => variant.some(v => v.figure === item.figure))) {
        variant.forEach(processAndAddVariants)
        return allVariants
      }
    }
  })

  return allVariants
}
