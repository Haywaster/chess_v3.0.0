import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'

import { type IBoard, type IKillVariant } from '../../../model'
import { useCheckersStore } from '../../../store'
import { getVariants } from '../../utils'

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

  const board: IBoard = { figures, cells }

  return activeFigureId =>
    getVariants({ board, activeFigureId, requiredFigures, rules })
}
