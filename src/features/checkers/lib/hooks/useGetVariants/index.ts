import { useCallback } from 'react'

import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'

import { useCheckers, type IKillVariant, type IBoard } from '../../../model'
import { isMoveValid, getKillVariants } from '../../utils'

interface Variants {
  cellsForMoving: ICell['id'][]
  killingVariants: IKillVariant[][]
}

interface UseGetVariants {
  (activeFigureId: IFigure['id']): Variants
}

export const useGetVariants = (): UseGetVariants => {
  const cells = useCheckers(state => state.cells)
  const figures = useCheckers(state => state.figures)

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

        if (isMoveValid(activeFigure, cell)) {
          cellsForMoving.push(cell.id)
          return
        }

        // kill figure logic
        const board: IBoard = { figures, cells }
        const variants = getKillVariants(activeFigure, board, cell)

        if (variants.length !== 0) {
          variants.forEach(variant => {
            killingVariants.push(variant)
          })
        }
      })

      return {
        cellsForMoving,
        killingVariants
      }
    },
    [cells, figures]
  )
}