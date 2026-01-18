import { useCallback } from 'react'

import type { IFigure } from 'entities/Figure'
import { useGame } from 'entities/Game'

import { useCheckersStore } from '../../../store'
import { useGetVariants } from '../useGetVariants'

export const useFigureClick = (): ((id: IFigure['id']) => void) => {
  const figures = useCheckersStore(state => state.figures)
  const activeFigure = useCheckersStore(state => state.activeFigure)
  const animatedFigure = useCheckersStore(state => state.animatedFigure)
  const stepColor = useCheckersStore(state => state.stepColor)
  const requiredFigures = useCheckersStore(state => state.requiredFigures)
  const setActiveFigure = useCheckersStore(state => state.setActiveFigure)
  const setCellsForMoving = useCheckersStore(state => state.setCellsForMoving)
  const setKillingVariants = useCheckersStore(state => state.setKillingVariants)
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
