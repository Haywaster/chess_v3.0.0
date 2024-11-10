import { useCallback } from 'react'

import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'
import { deepEqual } from 'shared/lib/utils/deepEqual.ts'
import { keepLargestArrays } from 'shared/lib/utils/keepLargestArrays.ts'

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
  const rules = useCheckers(state => state.rules)

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

        if (isMoveValid(board, activeFigure, cell)) {
          cellsForMoving.push(cell.id)
          return
        }

        const variants = getKillVariants(activeFigure, board, cell, rules)

        if (variants.length !== 0) {
          if (rules.killMaxFigure) {
            const maxKillVariants: IKillVariant[][] = []

            variants.forEach((currentVariant, index) => {
              let isCandidate: boolean = currentVariant.length === 1 || false
              const lastVariant = currentVariant[currentVariant.length - 1]

              variants.forEach((otherVariant, i) => {
                if (index === i) {
                  return
                }
                isCandidate = !otherVariant.some(v => deepEqual(v, lastVariant))
              })

              if (isCandidate) {
                maxKillVariants.push(currentVariant)
              }
            })

            keepLargestArrays(maxKillVariants).forEach(variant =>
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
    [cells, figures, rules]
  )
}
