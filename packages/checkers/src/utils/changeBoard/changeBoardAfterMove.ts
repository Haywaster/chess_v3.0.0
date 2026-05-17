import { makeFigureStain } from './makeFigureStain'

import type { ICell, IFigure, IBoard } from '../../types'

export const changeBoardAfterMove = (
  startCellId: ICell['id'],
  finishCellId: ICell['id'],
  board: IBoard
): IBoard => {
  const { figures, cells } = board
  const figureId = cells[startCellId].figureId

  if (figureId === null) {
    return board
  }

  const prevCell = { ...cells[startCellId] }
  prevCell.figureId = null

  const newCell: ICell = { ...cells[finishCellId], figureId }

  const changedFigure: IFigure = {
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
