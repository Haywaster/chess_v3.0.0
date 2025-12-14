import type { IFigure } from 'entities/Figure'

export interface ICell {
  id: number
  x: number
  y: number
  color: 'white' | 'black'
  figureId?: IFigure['id']
}
