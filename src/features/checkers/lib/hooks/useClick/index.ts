import { useCallback } from 'react'

import type { ICell } from 'entities/Cell'
import { type IFigure } from 'entities/Figure'

import { useCheckers } from '../../../model'
import { useGetVariants } from '../useGetVariants'
import { useMoveFigure } from '../useMoveFigure'

interface UseClick {
  onCellClick: (id: ICell['id']) => Promise<void>
  onFigureClick: (id: IFigure['id']) => void
}

export const useClick = (): UseClick => {
  const cells = useCheckers(state => state.cells)
  const figures = useCheckers(state => state.figures)
  const activeFigure = useCheckers(state => state.activeFigure)
  const killingVariants = useCheckers(state => state.killingVariants)
  const setActiveFigure = useCheckers(state => state.setActiveFigure)
  const setCellsForMoving = useCheckers(state => state.setCellsForMoving)
  const setKillingVariants = useCheckers(state => state.setKillingVariants)
  const setKillingFigure = useCheckers(state => state.setKillingFigure)
  const killFigure = useCheckers(state => state.killFigure)

  const getVariants = useGetVariants()
  const moveAnimate = useMoveFigure()

  const onCellClick = useCallback(
    async (id: ICell['id']): Promise<void> => {
      if (activeFigure) {
        setActiveFigure(null)

        const killVariants = killingVariants.filter(variant =>
          variant.some(v => v.finishCellId === id)
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
      }
    },
    [
      activeFigure,
      cells,
      figures,
      killFigure,
      killingVariants,
      moveAnimate,
      setActiveFigure,
      setKillingFigure
    ]
  )

  const onFigureClick = useCallback(
    (id: IFigure['id']): void => {
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
    },
    [
      activeFigure,
      getVariants,
      setActiveFigure,
      setCellsForMoving,
      setKillingVariants
    ]
  )

  return { onCellClick, onFigureClick }
}
