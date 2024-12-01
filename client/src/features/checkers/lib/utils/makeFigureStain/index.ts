import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'
import { BOARD_SIZE } from 'shared/const/numbers'

export const makeFigureStain = (figure: IFigure, newCell: ICell): boolean => {
  if (figure.isStain) {
    return true
  }

  return (
    (figure.color === 'white' && newCell.y === BOARD_SIZE) ||
    (figure.color === 'black' && newCell.y === 1)
  )
}
