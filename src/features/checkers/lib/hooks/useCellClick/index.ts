import { useCallback } from 'react'

import type { ICell } from 'entities/Cell'

import { type IBoard, useCheckers } from '../../../model'
import { useGetRequiredFigures } from '../useGetRequiredFigures'
import { useMoveFigure } from '../useMoveFigure'

export const useCellClick = (): ((id: ICell['id']) => Promise<void>) => {
  const cells = useCheckers(state => state.cells)
  const figures = useCheckers(state => state.figures)
  const activeFigure = useCheckers(state => state.activeFigure)
  const killingVariants = useCheckers(state => state.killingVariants)
  const stepColor = useCheckers(state => state.stepColor)
  const rules = useCheckers(state => state.rules)
  const setActiveFigure = useCheckers(state => state.setActiveFigure)
  const setKillingFigure = useCheckers(state => state.setKillingFigure)
  const killFigure = useCheckers(state => state.killFigure)
  const setStepColor = useCheckers(state => state.setStepColor)
  const setRequiredFigures = useCheckers(state => state.setRequiredFigures)

  const moveAnimate = useMoveFigure()
  const getRequiredFigures = useGetRequiredFigures()

  return useCallback(
    async (id: ICell['id']): Promise<void> => {
      if (activeFigure) {
        setActiveFigure(null)

        if (rules.requireKill) {
          setRequiredFigures([])
        }

        const killVariants = killingVariants.filter(
          variant => variant[variant.length - 1].finishCellId === id
        )
        const killVariant = killVariants.reduce((longest, current) => {
          return current.length > longest.length ? current : longest
        }, [])

        if (killVariant.length !== 0) {
          for (const variant of killVariant) {
            const index = killVariant.indexOf(variant)
            const startCell =
              index === 0
                ? cells[figures[activeFigure].cellId]
                : cells[killVariant[index - 1].finishCellId]
            const finishCell = cells[variant.finishCellId]

            setKillingFigure(variant.figure)
            await moveAnimate(startCell, finishCell)
            killFigure(variant.figure)
            setKillingFigure(null)
          }
        } else {
          const startCell = cells[figures[activeFigure].cellId]
          const finishCell = cells[id]

          await moveAnimate(startCell, finishCell)
        }

        setStepColor(stepColor === 'white' ? 'black' : 'white')

        if (rules.requireKill) {
          const cells = useCheckers.getState().cells
          const figures = useCheckers.getState().figures
          const board: IBoard = { cells, figures }

          getRequiredFigures(board)
        }
      }
    },
    [
      activeFigure,
      cells,
      figures,
      getRequiredFigures,
      killFigure,
      killingVariants,
      moveAnimate,
      rules.requireKill,
      setActiveFigure,
      setKillingFigure,
      setRequiredFigures,
      setStepColor,
      stepColor
    ]
  )
}
