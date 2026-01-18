import { useCallback } from 'react'

import type { ICell } from 'entities/Cell'
import { useGame } from 'entities/Game'
import { useWs } from 'shared/store'

import { type IBoard, type MoveFigureRequestWebsocket } from '../../../model'
import { useCheckersStore } from '../../../store'
import { useGetRequiredFigures } from '../useGetRequiredFigures'
import { useMoveFigure } from '../useMoveFigure'

export const useCellClick = (): ((id: ICell['id']) => Promise<void>) => {
  const cells = useCheckersStore(state => state.cells)
  const figures = useCheckersStore(state => state.figures)
  const activeFigure = useCheckersStore(state => state.activeFigure)
  const killingVariants = useCheckersStore(state => state.killingVariants)
  const stepColor = useCheckersStore(state => state.stepColor)
  const rules = useCheckersStore(state => state.rules)
  const setActiveFigure = useCheckersStore(state => state.setActiveFigure)
  const setKillingFigure = useCheckersStore(state => state.setKillingFigure)
  const killFigure = useCheckersStore(state => state.killFigure)
  const setStepColor = useCheckersStore(state => state.setStepColor)
  const setRequiredFigures = useCheckersStore(state => state.setRequiredFigures)
  const game = useGame()
  const ws = useWs()

  const moveAnimate = useMoveFigure()
  const getRequiredFigures = useGetRequiredFigures()

  return useCallback(
    async (id: ICell['id']): Promise<void> => {
      if (activeFigure !== null) {
        setActiveFigure(null)

        if (rules.requireKill) {
          setRequiredFigures([])
        }

        const killVariants = killingVariants.filter(
          variant => variant[variant.length - 1].finishCellId === id
        )
        const killVariant = killVariants.reduce(
          (longest, current) =>
            current.length > longest.length ? current : longest,
          []
        )

        if (killVariant.length !== 0) {
          for (const variant of killVariant) {
            const index = killVariant.indexOf(variant)
            const startCell =
              index === 0
                ? cells[figures[activeFigure].cellId]
                : cells[killVariant[index - 1].finishCellId]
            const finishCell = cells[variant.finishCellId]

            setKillingFigure(variant.figure)

            if (ws && game?.id) {
              const data: MoveFigureRequestWebsocket['data'] = {
                startCell,
                finishCell,
                gameId: game.id
              }

              const moveData: MoveFigureRequestWebsocket = {
                type: 'MOVE_FIGURE',
                data
              }
              ws.send(JSON.stringify(moveData))
            } else {
              await moveAnimate(startCell, finishCell)
            }

            killFigure(variant.figure)
            setKillingFigure(null)
          }
        } else {
          const startCell = cells[figures[activeFigure].cellId]
          const finishCell = cells[id]

          if (ws && game?.id) {
            const data: MoveFigureRequestWebsocket['data'] = {
              startCell,
              finishCell,
              gameId: game.id
            }

            const moveData: MoveFigureRequestWebsocket = {
              type: 'MOVE_FIGURE',
              data
            }
            ws.send(JSON.stringify(moveData))
          } else {
            await moveAnimate(startCell, finishCell)
            setStepColor(stepColor === 'white' ? 'black' : 'white')
          }
        }

        if (rules.requireKill) {
          const cells = useCheckersStore.getState().cells
          const figures = useCheckersStore.getState().figures
          const board: IBoard = { cells, figures }

          getRequiredFigures(board)
        }
      }
    },
    [
      activeFigure,
      cells,
      figures,
      game?.id,
      getRequiredFigures,
      killFigure,
      killingVariants,
      moveAnimate,
      rules.requireKill,
      setActiveFigure,
      setKillingFigure,
      setRequiredFigures,
      setStepColor,
      stepColor,
      ws
    ]
  )
}
