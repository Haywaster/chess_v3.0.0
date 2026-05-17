import type { ICell, IFigure, IBoard } from '../../types'

interface IMoveFigureInput {
  activeFigure: IFigure['id']
  cells: IBoard['cells']
  figures: IBoard['figures']
  id: ICell['id']
}

interface IMoveFigureResult {
  startCell: ICell
  finishCell: ICell
}

export const getMoveCoords = ({
  activeFigure,
  cells,
  figures,
  id
}: IMoveFigureInput): IMoveFigureResult => {
  const startCell = cells[figures[activeFigure].cellId]
  const finishCell = cells[id]

  return { startCell, finishCell }
}
