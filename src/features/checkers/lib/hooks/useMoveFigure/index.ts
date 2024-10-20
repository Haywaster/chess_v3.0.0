import { type CSSProperties, useState } from 'react'

import { type ICell } from 'entities/Cell'
import { ANIMATION_DURATION } from 'entities/Figure'
import { DOUBLE, TRANSLATE_PCT } from 'shared/const/numbers'

import { useCheckers } from '../../../model'

const calculateTransform = (n: number): string =>
  `${TRANSLATE_PCT * (1 + DOUBLE * n)}%`

interface UseMoveFigure {
  figureAnimation: CSSProperties | undefined
  moveAnimate: (startCell: ICell, finishCell: ICell) => Promise<void>
}

export const useMoveFigure = (): UseMoveFigure => {
  const [figureAnimation, setFigureAnimation] = useState<
    CSSProperties | undefined
  >(undefined)

  const moveFigure = useCheckers(state => state.moveFigure)

  const moveAnimate = async (
    startCell: ICell,
    finishCell: ICell
  ): Promise<void> => {
    const animationStyles: CSSProperties = {
      zIndex: 2,
      left: calculateTransform(finishCell.x - startCell.x),
      top: calculateTransform(finishCell.y - startCell.y)
    }

    setFigureAnimation(animationStyles)

    await new Promise<void>(res => {
      setTimeout((): void => {
        setFigureAnimation(undefined)
        res()
      }, ANIMATION_DURATION)
    })

    await new Promise<void>(res => {
      setTimeout((): void => {
        moveFigure(startCell.id, finishCell.id)
        res()
      }, 10)
    })
  }

  return {
    figureAnimation,
    moveAnimate
  }
}
