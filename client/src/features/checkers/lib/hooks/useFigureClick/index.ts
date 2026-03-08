import { useCallback } from 'react'

import type { IFigure } from 'entities/Figure'
import { useGame } from 'entities/Game'

import type { IBoard } from '../../../model'
import { useCheckersStore } from '../../../store'
import { getVariants } from '../../utils'

export const useFigureClick = (): ((id: IFigure['id']) => void) => {
  const cells = useCheckersStore(state => state.cells)
  const rules = useCheckersStore(state => state.rules)
  const figures = useCheckersStore(state => state.figures)
  const activeFigure = useCheckersStore(state => state.activeFigure)
  const animatedFigure = useCheckersStore(state => state.animatedFigure)
  const stepColor = useCheckersStore(state => state.stepColor)
  const requiredFigures = useCheckersStore(state => state.requiredFigures)
  const setActiveFigure = useCheckersStore(state => state.setActiveFigure)
  const setCellsForMoving = useCheckersStore(state => state.setCellsForMoving)
  const setKillingVariants = useCheckersStore(state => state.setKillingVariants)

  const game = useGame()

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
          const board: IBoard = { cells, figures }
          const { cellsForMoving, killingVariants } = getVariants({
            board,
            id,
            requiredFigures,
            rules
          })
          setActiveFigure(id)
          setCellsForMoving(cellsForMoving)
          setKillingVariants(killingVariants)
        }
      }
    },
    [
      activeFigure,
      animatedFigure.id,
      cells,
      figures,
      game,
      requiredFigures,
      rules,
      setActiveFigure,
      setCellsForMoving,
      setKillingVariants,
      stepColor
    ]
  )
}
