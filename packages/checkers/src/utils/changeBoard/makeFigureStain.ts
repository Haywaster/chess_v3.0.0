import { BOARD_SIZE } from '../../const'

import type { ICell, IFigure } from '../../types'

export const makeFigureStain = (figure: IFigure, newCell: ICell): boolean => {
  if (figure.isStain) {
    return true
  }

  return (
    (figure.color === 'white' && newCell.y === BOARD_SIZE) ||
    (figure.color === 'black' && newCell.y === 1)
  )
}
