import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'
import { keepLargestArrays } from 'shared/lib'

import { getKillVariants, isMoveValid } from '../../lib'
import type { IBoard, IKillVariant, Rules } from '../../model'

interface IGetVariantInput {
  board: IBoard
  activeFigureId: IFigure['id']
  requiredFigures: IFigure['id'][]
  rules: Record<Rules, boolean>
}

interface IGetVariantResult {
  cellsForMoving: ICell['id'][]
  killingVariants: IKillVariant[][]
}

export const getVariants = ({
  board,
  activeFigureId,
  requiredFigures,
  rules
}: IGetVariantInput): IGetVariantResult => {
  const { cells, figures } = board
  const cellsForMoving: ICell['id'][] = []
  const killingVariants: IKillVariant[][] = []

  const activeFigure = figures[activeFigureId]

  Object.values(cells).forEach(cell => {
    const diagonalCondition =
      Math.abs(cell.x - activeFigure.x) === Math.abs(cell.y - activeFigure.y)

    if (!diagonalCondition) {
      return
    }

    const board: IBoard = { figures, cells }
    const requireKillCondition =
      requiredFigures.includes(activeFigureId) &&
      isMoveValid(board, activeFigure, cell)

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
