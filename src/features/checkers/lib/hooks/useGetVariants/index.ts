import { useCallback } from 'react'

import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'
import { boardCellsIds } from 'features/checkers/lib/utils/createBoard'
import { DOUBLE } from 'shared/const/numbers'

import { useCheckers, type IKillVariant } from '../../../model'
import { isMoveValid } from '../../utils'

interface Variants {
  cellsForMoving: ICell['id'][]
  killingVariants: IKillVariant[]
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
      const killingVariants: IKillVariant[] = []

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
        }

        // kill figure logic
        const isEnemyFigure =
          Math.abs(cell.x - activeFigure.x) === 1 &&
          cell.figureId &&
          figures[cell.figureId].color !== activeFigure.color
        const isCandidateNotBoard =
          isEnemyFigure && !boardCellsIds.includes(cell.id)

        if (isCandidateNotBoard) {
          const afterCellId = DOUBLE * cell.id - activeFigure.cellId
          const isAfterCellFree = !cells[afterCellId].figureId

          if (isAfterCellFree) {
            const variant: IKillVariant = {
              figure: cell.figureId as IFigure['id'],
              finishCellId: cells[afterCellId].id
            }

            killingVariants.push(variant)
          }
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
