import { useCallback } from 'react'

import type { ICell } from 'entities/Cell'
import { useGame } from 'entities/Game'
import { useWs } from 'shared/store'

import {
  CheckersActionType,
  type IBoard,
  type MoveFigureRequestWebsocket,
  type KillFigureRequestWebsocket
} from '../../../model'
import { useCheckersStore } from '../../../store'
import { getRequiredFigures, getKillCoords, getMoveCoords } from '../../utils'
import { useMoveFigure } from '../useMoveFigure'

export const useCellClick = (): ((id: ICell['id']) => Promise<void>) => {
  const cells = useCheckersStore(state => state.cells)
  const figures = useCheckersStore(state => state.figures)
  const activeFigure = useCheckersStore(state => state.activeFigure)
  const allKillVariants = useCheckersStore(state => state.killingVariants)
  const stepColor = useCheckersStore(state => state.stepColor)
  const rules = useCheckersStore(state => state.rules)
  const setActiveFigure = useCheckersStore(state => state.setActiveFigure)
  const setKillingFigure = useCheckersStore(state => state.setKillingFigure)
  const killFigureFromBoard = useCheckersStore(state => state.killFigure)
  const setStepColor = useCheckersStore(state => state.setStepColor)
  const setRequiredFigures = useCheckersStore(state => state.setRequiredFigures)

  const game = useGame()
  const ws = useWs()
  const moveAnimate = useMoveFigure()

  return useCallback(
    async (id: ICell['id']): Promise<void> => {
      if (activeFigure !== null) {
        setActiveFigure(null)

        if (rules.requireKill) {
          setRequiredFigures([])
        }

        const killVariant = allKillVariants
          .filter(variant => variant[variant.length - 1].finishCellId === id)
          .reduce(
            (longest, current) =>
              current.length > longest.length ? current : longest,
            []
          )

        if (killVariant.length !== 0) {
          const killCoords = getKillCoords({
            activeFigure,
            cells,
            figures,
            killVariant
          })

          for (const { startCell, finishCell, figureId } of killCoords) {
            setKillingFigure(figureId)

            if (ws && game?.id) {
              const data: KillFigureRequestWebsocket['data'] = {
                startCell,
                finishCell,
                figureId,
                gameId: game.id
              }

              const killData: KillFigureRequestWebsocket = {
                type: CheckersActionType.KILL_FIGURE,
                data
              }
              ws.send(JSON.stringify(killData))
            } else {
              await moveAnimate(startCell, finishCell)
            }

            killFigureFromBoard(figureId)
            setKillingFigure(null)
          }
        } else {
          const { startCell, finishCell } = getMoveCoords({
            activeFigure,
            cells,
            figures,
            id
          })

          if (ws && game?.id) {
            const data: MoveFigureRequestWebsocket['data'] = {
              startCell,
              finishCell,
              gameId: game.id
            }

            const moveData: MoveFigureRequestWebsocket = {
              type: CheckersActionType.MOVE_FIGURE,
              data
            }
            ws.send(JSON.stringify(moveData))
          } else {
            await moveAnimate(startCell, finishCell)
            setStepColor(stepColor === 'white' ? 'black' : 'white')
          }
        }

        if (rules.requireKill) {
          // TODO: Нужен ли здесь useCheckersStore.getState() ?
          const cells = useCheckersStore.getState().cells
          const figures = useCheckersStore.getState().figures
          const board: IBoard = { cells, figures }

          const requiredFigures = getRequiredFigures(board, stepColor, rules)

          if (requiredFigures.length !== 0) {
            setRequiredFigures(requiredFigures)
          }
        }
      }
    },
    [
      activeFigure,
      cells,
      figures,
      game?.id,
      killFigureFromBoard,
      allKillVariants,
      moveAnimate,
      rules,
      setActiveFigure,
      setKillingFigure,
      setRequiredFigures,
      setStepColor,
      stepColor,
      ws
    ]
  )
}
