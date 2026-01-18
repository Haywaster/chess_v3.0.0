import { useCallback } from 'react'

import type { IFigure } from 'entities/Figure'
import { useGame } from 'entities/Game'

import { useCheckers } from '../../../store'
import { useGetVariants } from '../useGetVariants'

export const useFigureClick = (): ((id: IFigure['id']) => void) => {
  const figures = useCheckers(state => state.figures)
  const activeFigure = useCheckers(state => state.activeFigure)
  const animatedFigure = useCheckers(state => state.animatedFigure)
  const stepColor = useCheckers(state => state.stepColor)
  const requiredFigures = useCheckers(state => state.requiredFigures)
  const setActiveFigure = useCheckers(state => state.setActiveFigure)
  const setCellsForMoving = useCheckers(state => state.setCellsForMoving)
  const setKillingVariants = useCheckers(state => state.setKillingVariants)
  const game = useGame()

  const getVariants = useGetVariants()

  return useCallback(
    (id: IFigure['id']): void => {
      if (
        ((!game || game.userData.color === figures[id].color) &&
          stepColor === figures[id].color &&
          requiredFigures.length === 0 &&
          animatedFigure.id === null) ||
        requiredFigures.includes(id)
      ) {
        if (activeFigure === id) {
          setActiveFigure(null)
          setCellsForMoving([])
          setKillingVariants([])
        } else {
          const { cellsForMoving, killingVariants } = getVariants(id)
          setActiveFigure(id)
          setCellsForMoving(cellsForMoving)
          setKillingVariants(killingVariants)
        }
      }
    },
    [
      activeFigure,
      animatedFigure.id,
      figures,
      game,
      getVariants,
      requiredFigures,
      setActiveFigure,
      setCellsForMoving,
      setKillingVariants,
      stepColor
    ]
  )
}
