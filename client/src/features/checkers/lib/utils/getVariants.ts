import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'
import { keepLargestArrays } from 'shared/lib'

import type { IBoard, IKillVariant, Rules } from '../../model'

import { getKillVariants } from './kill'
import { isMoveValid } from './move'

interface IGetVariantInput {
  board: IBoard
  id: IFigure['id']
  requiredFigures: IFigure['id'][]
  rules: Record<Rules, boolean>
}

interface IGetVariantResult {
  cellsForMoving: ICell['id'][]
  killingVariants: IKillVariant[][]
}

export const getVariants = ({
  board,
  id,
  requiredFigures,
  rules
}: IGetVariantInput): IGetVariantResult => {
  const { cells, figures } = board
  const cellsForMoving: ICell['id'][] = []
  const killingVariants: IKillVariant[][] = []

  const activeFigure = figures[id]

  Object.values(cells).forEach(cell => {
    const diagonalCondition =
      Math.abs(cell.x - activeFigure.x) === Math.abs(cell.y - activeFigure.y)

    if (!diagonalCondition) {
      return
    }

    const requireKillCondition =
      requiredFigures.includes(id) && isMoveValid(board, activeFigure, cell)

    if (requireKillCondition) {
      return
    }

    if (isMoveValid(board, activeFigure, cell)) {
      cellsForMoving.push(cell.id)
      return
    }

    const variants = getKillVariants(activeFigure, board, cell, rules)

    if (variants.length !== 0) {
      if (rules.killMaxFigure) {
        keepLargestArrays(variants).forEach(variant =>
          killingVariants.push(variant)
        )
      } else {
        variants.forEach(variant => killingVariants.push(variant))
      }
    }
  })

  return {
    cellsForMoving,
    killingVariants
  }
}
