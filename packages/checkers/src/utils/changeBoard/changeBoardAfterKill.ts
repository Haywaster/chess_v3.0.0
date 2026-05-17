import type { IFigure, IBoard } from '../../types'

export const changeBoardAfterKill = (
  id: IFigure['id'],
  board: IBoard
): IBoard => {
  const { figures, cells } = board

  const figure = figures[id]
  const cell = cells[figure.cellId]

  cell.figureId = null
  delete figures[id]

  return {
    cells: {
      ...cells,
      [figure.cellId]: cell
    },
    figures
  }
}
