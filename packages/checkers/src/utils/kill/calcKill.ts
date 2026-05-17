import { DOUBLE, CheckersRules } from '../../const'
import { boardCellsIds } from '../createBoard'
import { calcFigureMove } from '../move'

import type {
  ICell,
  IFigure,
  IBoard,
  IKillVariant,
  TCheckersRules
} from '../../types'

export const calcFigureKill = (
  cells: IBoard['cells'],
  activeFigure: IFigure,
  cell: ICell,
  rules: Record<TCheckersRules, boolean>
): IKillVariant | undefined => {
  const moveCondition = rules[CheckersRules.behindKill]
    ? Math.abs(cell.x - activeFigure.x) === 1
    : calcFigureMove(activeFigure, cell)

  if (!moveCondition) {
    return
  }

  const afterCellId = DOUBLE * cell.id - activeFigure.cellId
  const isAfterCellFree = cells[afterCellId].figureId === null

  if (isAfterCellFree) {
    return {
      figure: cell.figureId as IFigure['id'],
      finishCellId: cells[afterCellId].id
    }
  }
}

// Остановка сразу после фигуры
export const calcStainKillSingleCell = (
  cells: IBoard['cells'],
  activeFigure: IFigure,
  cell: ICell
): IKillVariant | undefined => {
  const idDifference = cell.id - activeFigure.cellId
  const xDifference = cell.x - activeFigure.x
  const directionId = idDifference / Math.abs(xDifference)

  const beforeCellId = cell.id - directionId
  const afterCellId = cell.id + directionId

  const isBeforeCellFree =
    beforeCellId === activeFigure.cellId
      ? true
      : cells[beforeCellId].figureId === null
  const isAfterCellFree = cells[afterCellId].figureId === null

  if (isBeforeCellFree && isAfterCellFree) {
    return {
      figure: cell.figureId as IFigure['id'],
      finishCellId: cells[afterCellId].id
    }
  }
}

// Остановка в любом месте после фигуры
export const calcStainKillManyCells = (
  cells: IBoard['cells'],
  activeFigure: IFigure,
  cell: ICell
): IKillVariant[] | undefined => {
  const idDifference = cell.id - activeFigure.cellId
  const xDifference = cell.x - activeFigure.x
  const directionId = idDifference / Math.abs(xDifference)

  const beforeCellId = cell.id - directionId

  const isBeforeCellFree =
    beforeCellId === activeFigure.cellId ||
    cells[beforeCellId].figureId === null

  const afterFreeCells: ICell[] = []
  let afterCellId = cell.id + directionId
  const limitId = afterCellId > cell.id ? Object.keys(cells).length : 0

  while (Math.abs(afterCellId - limitId) > 0) {
    if (cells[afterCellId].figureId !== null) {
      break
    }

    if (boardCellsIds.includes(afterCellId)) {
      afterFreeCells.push(cells[afterCellId])
      break
    }

    afterFreeCells.push(cells[afterCellId])
    afterCellId += directionId
  }

  if (isBeforeCellFree && afterFreeCells.length) {
    return afterFreeCells.map(freeCell => ({
      figure: cell.figureId as IFigure['id'],
      finishCellId: freeCell.id
    }))
  }
}
