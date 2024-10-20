import { type CSSProperties } from 'react'

import { type ICell } from 'entities/Cell'
import { ANIMATION_DURATION } from 'entities/Figure'
import { DOUBLE, TRANSLATE_PCT } from 'shared/const/numbers'

import { RENDER_DURATION } from '../../../const'
import { useCheckers } from '../../../model'

const calculateTransform = (n: number): string =>
  `${TRANSLATE_PCT * (1 + DOUBLE * n)}%`

interface UseMoveFigure {
  (startCell: ICell, finishCell: ICell): Promise<void>
}

export const useMoveFigure = (): UseMoveFigure => {
  const activeFigure = useCheckers(state => state.activeFigure)
  const moveFigure = useCheckers(state => state.moveFigure)
  const setAnimatedFigure = useCheckers(state => state.setAnimatedFigure)

  return async (startCell: ICell, finishCell: ICell): Promise<void> => {
    // Задержка установлена для того, чтобы фигура успела отрендериться после предыдущего перемещения
    await new Promise<void>(res => {
      setTimeout((): void => {
        res()
      }, RENDER_DURATION)
    })

    const animationStyles: CSSProperties = {
      zIndex: 2,
      left: calculateTransform(finishCell.x - startCell.x),
      top: calculateTransform(finishCell.y - startCell.y)
    }
    setAnimatedFigure(activeFigure, animationStyles)

    await new Promise<void>(res => {
      setTimeout((): void => {
        setAnimatedFigure(null, undefined)
        moveFigure(startCell.id, finishCell.id)
        res()
      }, ANIMATION_DURATION)
    })
  }
}
