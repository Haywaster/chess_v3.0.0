import { useCallback } from 'react'

import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'
import { keepLargestArrays } from 'shared/lib'

import { type IKillVariant, type IBoard } from '../../../model'
import { useCheckersStore } from '../../../store'
import { isMoveValid, getKillVariants } from '../../utils'

interface Variants {
  cellsForMoving: ICell['id'][]
  killingVariants: IKillVariant[][]
}

interface UseGetVariants {
  (activeFigureId: IFigure['id']): Variants
}

export const useGetVariants = (): UseGetVariants => {
  const cells = useCheckersStore(state => state.cells)
  const figures = useCheckersStore(state => state.figures)
  const rules = useCheckersStore(state => state.rules)
  const requiredFigures = useCheckersStore(state => state.requiredFigures)

  return useCallback(
    activeFigureId => {
      const cellsForMoving: ICell['id'][] = []
      const killingVariants: IKillVariant[][] = []

      const activeFigure = figures[activeFigureId]

      Object.values(cells).forEach(cell => {
        const diagonalCondition =
          Math.abs(cell.x - activeFigure.x) ===
          Math.abs(cell.y - activeFigure.y)

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
    },
    [cells, figures, requiredFigures, rules]
  )
}
