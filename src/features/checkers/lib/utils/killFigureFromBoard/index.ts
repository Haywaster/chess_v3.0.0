import type { IFigure } from 'entities/Figure'

import type { IBoard } from '../../../model'

export const killFigureFromBoard = (
  id: IFigure['id'],
  board: IBoard
): IBoard['cells'] => {
  const { figures, cells } = board

  const figure = figures[id]
  const cell = cells[figure.cellId]

  delete cell.figureId
  delete figures[id]

  return {
    ...cells,
    [figure.cellId]: cell
  }
}
