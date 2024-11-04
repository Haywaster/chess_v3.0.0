import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'
import { boardCellsIds } from 'features/checkers/const'
import type { IBoard, IKillVariant } from 'features/checkers/model'
import { DOUBLE } from 'shared/const/numbers'

export const calcFigureKill = (
  cells: IBoard['cells'],
  activeFigure: IFigure,
  cell: ICell
): IKillVariant | undefined => {
  const moveCondition = Math.abs(cell.x - activeFigure.x) === 1

  if (!moveCondition) {
    return
  }

  const afterCellId = DOUBLE * cell.id - activeFigure.cellId
  const isAfterCellFree = !('figureId' in cells[afterCellId])

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
      : !('figureId' in cells[beforeCellId])
  const isAfterCellFree = !('figureId' in cells[afterCellId])

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
    beforeCellId === activeFigure.cellId || !('figureId' in cells[beforeCellId])

  const afterFreeCells: ICell[] = []
  let afterCellId = cell.id + directionId
  const limitId = afterCellId > cell.id ? Object.keys(cells).length : 0

  while (Math.abs(afterCellId - limitId) > 0) {
    if ('figureId' in cells[afterCellId]) {
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
