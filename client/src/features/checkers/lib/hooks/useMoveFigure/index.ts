import { type CSSProperties, useCallback } from 'react'

import { type ICell } from 'entities/Cell'
import { DOUBLE, TRANSLATE_PCT } from 'shared/const/numbers'

import { RENDER_DURATION } from '../../../model'
import {
  useMoveFigure as useMoveFigureStore,
  useSetAnimatedFigure
} from '../../../store'

const ANIMATION_DURATION = 200

const calculateTransform = (n: number): string =>
  `${TRANSLATE_PCT * (1 + DOUBLE * n)}%`

export const useMoveFigure = (): ((
  startCell: ICell,
  finishCell: ICell
) => Promise<void>) => {
  const moveFigure = useMoveFigureStore()
  const setAnimatedFigure = useSetAnimatedFigure()

  return useCallback(
    async (startCell, finishCell) => {
      // Задержка установлена для того, чтобы фигура успела отрендериться на своем новом месте
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
      setAnimatedFigure(startCell.figureId ?? null, animationStyles)

      await new Promise<void>(res => {
        setTimeout((): void => {
          setAnimatedFigure(null, undefined)
          moveFigure(startCell.id, finishCell.id)
          res()
        }, ANIMATION_DURATION)
      })
    },
    [moveFigure, setAnimatedFigure]
  )
}
