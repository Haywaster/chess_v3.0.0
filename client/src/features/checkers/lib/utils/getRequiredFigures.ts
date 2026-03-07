import type { IFigure } from 'entities/Figure'

import { getKillVariants } from '../../lib'
import { type IBoard, type Rules } from '../../model'

export const getRequiredFigures = (
  board: IBoard,
  stepColor: IFigure['color'],
  rules: Record<Rules, boolean>
): IFigure['id'][] => {
  const { cells, figures } = board

  const enemyFigures = Object.values(figures).filter(
    figure => figure.color !== stepColor
  )
  const requiredFigures: IFigure['id'][] = []

  enemyFigures.forEach(figure => {
    for (const cell of Object.values(cells)) {
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

  return requiredFigures
}
