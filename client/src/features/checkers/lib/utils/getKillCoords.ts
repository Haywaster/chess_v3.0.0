import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'

import type { IBoard, IKillVariant } from '../../model'

interface IGetKillCoordsInput {
  activeFigure: IFigure['id']
  cells: IBoard['cells']
  figures: IBoard['figures']
  killVariant: IKillVariant[]
}

interface IGetKillCoordsResult {
  startCell: ICell
  finishCell: ICell
  figureId: IFigure['id']
}

export const getKillCoords = ({
  activeFigure,
  cells,
  figures,
  killVariant
}: IGetKillCoordsInput): IGetKillCoordsResult[] => {
  return killVariant.map((variant, index) => {
    const startCell =
      index === 0
        ? cells[figures[activeFigure].cellId]
        : cells[killVariant[index - 1].finishCellId]
    const finishCell = cells[variant.finishCellId]

    return { startCell, finishCell, figureId: variant.figure }
  })
}
