import { useCallback } from 'react'
import toast from 'react-hot-toast'

import type { IFigure } from 'entities/Figure'
import { GameMode, GameStatus } from 'entities/Game'

import { useCheckersStore } from '../../store'
import { getVariants } from '../utils'

import type { IBoard } from '../../model'

export const useFigureClick = (): ((id: IFigure['id']) => void) => {
  const cells = useCheckersStore(state => state.cells)
  const figures = useCheckersStore(state => state.figures)
  const rules = useCheckersStore(state => state.rules)
  const userColor = useCheckersStore(state => state.userColor)
  const activeFigure = useCheckersStore(state => state.activeFigure)
  const animatedFigure = useCheckersStore(state => state.animatedFigure)
  const stepColor = useCheckersStore(state => state.stepColor)
  const requiredFigures = useCheckersStore(state => state.requiredFigures)
  const mode = useCheckersStore(state => state.mode)
  const status = useCheckersStore(state => state.status)
  const setActiveFigure = useCheckersStore(state => state.setActiveFigure)
  const setCellsForMoving = useCheckersStore(state => state.setCellsForMoving)
  const setKillingVariants = useCheckersStore(state => state.setKillingVariants)

  const checkGameMode = useCallback(
    (id: IFigure['id']): boolean => {
      switch (mode) {
        case GameMode.SINGLE:
        case GameMode.OFFLINE:
          return stepColor === figures[id].color
        case GameMode.COUPLE:
          return (
            userColor === figures[id].color && stepColor === figures[id].color
          )
        default:
          return false
      }
    },
    [figures, mode, stepColor, userColor]
  )

  const isLoading = status === GameStatus.PENDING && mode === GameMode.COUPLE

  return useCallback(
    (id: IFigure['id']): void => {
      const baseRulesClick =
        checkGameMode(id) &&
        !requiredFigures.length &&
        animatedFigure.id === null
      const isRequiredFigure = requiredFigures.includes(id)

      if (!baseRulesClick && !isRequiredFigure) {
        return
      }

      if (isLoading) {
        toast.error('Ход невозможен. Дождитесь второго игрока')
        return
      }

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
    },
    [
      activeFigure,
      animatedFigure.id,
      cells,
      checkGameMode,
      figures,
      isLoading,
      requiredFigures,
      rules,
      setActiveFigure,
      setCellsForMoving,
      setKillingVariants
    ]
  )
}
