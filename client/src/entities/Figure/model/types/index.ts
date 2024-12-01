import type { ICell } from 'entities/Cell'

export interface IFigure {
  id: number
  x: number
  y: number
  color: 'white' | 'black'
  isStain: boolean
  cellId: ICell['id']
}
