import { type ICell } from 'entities/Cell'

import { type IBoard } from '../../../model'
import { makeFigureStain } from '../makeFigureStain'

export const changeBoardAfterMove = (
  startCellId: ICell['id'],
  finishCellId: ICell['id'],
  board: IBoard
): IBoard => {
  const { figures, cells } = board
  const figureId = cells[startCellId].figureId

  if (figureId === undefined) {
    return board
  }

  const prevCell = { ...cells[startCellId] }
  delete prevCell.figureId

  const newCell = { ...cells[finishCellId], figureId }

  const changedFigure = {
    ...figures[figureId],
    cellId: finishCellId,
    isStain: makeFigureStain(figures[figureId], newCell),
    x: newCell.x,
    y: newCell.y
  }

  return {
    cells: {
      ...cells,
      [startCellId]: prevCell,
      [finishCellId]: newCell
    },
    figures: {
      ...figures,
      [figureId]: changedFigure
    }
  }
}
