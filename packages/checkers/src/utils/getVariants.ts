import { keepLargestArrays } from '@game-workspace/shared'

import { CheckersRules } from '../const'

import { getKillVariants } from './kill'
import { isMoveValid } from './move'

import type {
  ICell,
  IFigure,
  IBoard,
  IKillVariant,
  TCheckersRules
} from '../types'

interface IGetVariantInput {
  board: IBoard
  id: IFigure['id']
  requiredFigures: IFigure['id'][]
  rules: Record<TCheckersRules, boolean>
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
      if (rules[CheckersRules.killMaxFigure]) {
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
