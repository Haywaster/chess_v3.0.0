import type { IFigure } from 'entities/Figure'

import { type IBoard } from '../../../model'
import { useCheckers } from '../../../store'
import { getKillVariants } from '../../utils'

export const useGetRequiredFigures = (): ((board: IBoard) => void) => {
  const stepColor = useCheckers(state => state.stepColor)
  const rules = useCheckers(state => state.rules)
  const setRequiredFigures = useCheckers(state => state.setRequiredFigures)

  return (board: IBoard) => {
    const enemyFigures = Object.values(board.figures).filter(
      figure => figure.color !== stepColor
    )
    const requiredFigures: IFigure['id'][] = []

    enemyFigures.forEach(figure => {
      for (const cell of Object.values(useCheckers.getState().cells)) {
        const diagonalCondition =
          Math.abs(cell.x - figure.x) === Math.abs(cell.y - figure.y)

        if (!diagonalCondition) {
          continue
        }

        const variants = getKillVariants(figure, board, cell, rules)

        if (variants.length !== 0) {
          requiredFigures.push(figure.id)
          break
        }
      }
    })

    if (requiredFigures.length !== 0) {
      setRequiredFigures(requiredFigures)
    }
  }
}
