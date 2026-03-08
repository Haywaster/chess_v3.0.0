import type { IFigure } from 'entities/Figure'

import type { IBoard } from '../../../model'

export const changeBoardAfterKill = (
  id: IFigure['id'],
  board: IBoard
): IBoard => {
  const { figures, cells } = board

  const figure = figures[id]
  const cell = cells[figure.cellId]

  delete cell.figureId
  delete figures[id]

  return {
    cells: {
      ...cells,
      [figure.cellId]: cell
    },
    figures
  }
}
