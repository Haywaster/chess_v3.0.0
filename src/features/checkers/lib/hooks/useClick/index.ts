import { type CSSProperties, useCallback, useState } from 'react'

import type { ICell } from 'entities/Cell'
import { type IFigure, ANIMATION_DURATION } from 'entities/Figure'
import { DOUBLE, TRANSLATE_PCT } from 'shared/const/numbers'

import { useCheckers } from '../../../model'
import { useActiveCells } from '../useActiveCells'

const calculateTransform = (n: number): string =>
  `${TRANSLATE_PCT * (1 + DOUBLE * n)}%`

interface UseClick {
  onCellClick: (id: ICell['id']) => Promise<void>
  onFigureClick: (id: IFigure['id']) => void
  figureAnimation: CSSProperties | undefined
  animatedFigureId: IFigure['id'] | null
}

export const useClick = (): UseClick => {
  const [animatedFigureId, setAnimatedFigureId] = useState<
    IFigure['id'] | null
  >(null)
  const [figureAnimation, setFigureAnimation] = useState<
    CSSProperties | undefined
  >(undefined)

  const cells = useCheckers(state => state.cells)
  const figures = useCheckers(state => state.figures)
  const activeFigure = useCheckers(state => state.activeFigure)
  const setActiveFigure = useCheckers(state => state.setActiveFigure)
  const setActiveCells = useCheckers(state => state.setActiveCells)
  const moveFigure = useCheckers(state => state.moveFigure)

  const getActiveCells = useActiveCells()

  const onCellClick = useCallback(
    async (id: ICell['id']): Promise<void> => {
      if (activeFigure) {
        setActiveFigure(null)
        setAnimatedFigureId(activeFigure)

        const animationStyles: CSSProperties = {
          left: calculateTransform(cells[id].x - figures[activeFigure].x),
          top: calculateTransform(cells[id].y - figures[activeFigure].y)
        }
        setFigureAnimation(animationStyles)

        await new Promise<void>(res => {
          setTimeout(() => {
            setFigureAnimation(undefined)
            setAnimatedFigureId(null)
            res()
          }, ANIMATION_DURATION)
        })

        await new Promise<void>(res => {
          setTimeout(() => {
            moveFigure(id, activeFigure)
            res()
          })
        })
      }
    },
    [activeFigure, cells, figures, moveFigure, setActiveFigure]
  )

  const onFigureClick = useCallback(
    (id: IFigure['id']): void => {
      if (activeFigure === id) {
        setActiveFigure(null)
        setActiveCells([])
      } else {
        setActiveFigure(id)
        setActiveCells(getActiveCells(id))
      }
    },
    [activeFigure, getActiveCells, setActiveCells, setActiveFigure]
  )

  return {
    onCellClick,
    onFigureClick,
    figureAnimation,
    animatedFigureId
  }
}
