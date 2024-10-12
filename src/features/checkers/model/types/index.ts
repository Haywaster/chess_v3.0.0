import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'

export interface IBoard {
  cells: Record<number, ICell>
  figures: Record<number, IFigure>
}
