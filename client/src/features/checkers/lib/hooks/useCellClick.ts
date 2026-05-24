import { useCallback } from 'react'

import type { ICell } from 'entities/Cell'
import { GameMode } from 'entities/Game'
import { useWs } from 'shared/store'

import {
  CheckersActionType,
  type IBoard,
  type MoveFigureRequestWebsocket,
  type KillFigureRequestWebsocket,
  Rules
} from '../../model'
import { useCheckersStore } from '../../store'
import { getRequiredFigures, getKillCoords, getMoveCoords } from '../utils'

import { useMoveFigure } from './useMoveFigure'

export const useCellClick = (): ((id: ICell['id']) => Promise<void>) => {
  const cells = useCheckersStore(state => state.cells)
  const figures = useCheckersStore(state => state.figures)
  const activeFigure = useCheckersStore(state => state.activeFigure)
  const allKillVariants = useCheckersStore(state => state.killingVariants)
  const stepColor = useCheckersStore(state => state.stepColor)
  const rules = useCheckersStore(state => state.rules)
  const setActiveFigure = useCheckersStore(state => state.setActiveFigure)
  const setKillingFigure = useCheckersStore(state => state.setKillingFigure)
  const killFigure = useCheckersStore(state => state.killFigure)
  const setStepColor = useCheckersStore(state => state.setStepColor)
  const setRequiredFigures = useCheckersStore(state => state.setRequiredFigures)
  const mode = useCheckersStore(state => state.mode)

  const ws = useWs()
  const moveAnimate = useMoveFigure()

  return useCallback(
    async (id: ICell['id']): Promise<void> => {
      if (activeFigure !== null) {
        setActiveFigure(null)

        if (rules[Rules.requireKill]) {
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

            if (ws && mode === GameMode.COUPLE) {
              const data: KillFigureRequestWebsocket['data'] = {
                startCell,
                finishCell,
                figureId
              }

              const killData: KillFigureRequestWebsocket = {
                type: CheckersActionType.KILL_FIGURE,
                data
              }
              // TODO: Хотелось бы здесь получать данные, возвращаемые с сервера и работать с ними тут
              ws.send(JSON.stringify(killData))
            } else {
              await moveAnimate(startCell, finishCell)
              killFigure(figureId)
              setKillingFigure(null)
            }
          }
        } else {
          const { startCell, finishCell } = getMoveCoords({
            activeFigure,
            cells,
            figures,
            id
          })

          if (ws && mode === GameMode.COUPLE) {
            const data: MoveFigureRequestWebsocket['data'] = {
              startCell,
              finishCell
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

        if (rules[Rules.requireKill]) {
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
      setActiveFigure,
      rules,
      allKillVariants,
      setRequiredFigures,
      cells,
      figures,
      setKillingFigure,
      ws,
      mode,
      killFigure,
      moveAnimate,
      setStepColor,
      stepColor
    ]
  )
}
