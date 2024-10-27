import type { CSSProperties } from 'react'
import { create } from 'zustand'

import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'

import { initialCells } from '../../const'
import { makeFigureStain } from '../../lib'
import type { IBoard, IKillVariant } from '../types'

interface State {
  figures: IBoard['figures']
  cells: IBoard['cells']
  activeFigure: IFigure['id'] | null
  cellsForMoving: ICell['id'][]
  killingVariants: IKillVariant[][]
  animatedFigure: {
    id: IFigure['id'] | null
    styles: CSSProperties | undefined
  }
  killingFigure: IFigure['id'] | null
}

interface Action {
  reset: () => void
  setActiveFigure: (id: IFigure['id'] | null) => void
  setCellsForMoving: (cells: ICell['id'][]) => void
  setKillingVariants: (variants: IKillVariant[][]) => void
  moveFigure: (cellId: ICell['id'], figureId: ICell['id']) => void
  setAnimatedFigure: (
    id: IFigure['id'] | null,
    styles: CSSProperties | undefined
  ) => void
  setKillingFigure: (id: IFigure['id'] | null) => void
  killFigure: (id: IFigure['id']) => void
}

const initialState: State = {
  ...initialCells,
  activeFigure: null,
  cellsForMoving: [], // ячейки для перемещения
  killingVariants: [], // варианты срубки
  animatedFigure: {
    id: null,
    styles: undefined
  },
  killingFigure: null
}

export const useCheckers = create<State & Action>(set => ({
  ...initialState,
  reset: () => set({ ...initialState }),
  setActiveFigure: (id: IFigure['id'] | null) => set({ activeFigure: id }),
  setCellsForMoving: (cells: ICell['id'][]) => set({ cellsForMoving: cells }),
  setAnimatedFigure: (
    id: IFigure['id'] | null,
    styles: CSSProperties | undefined
  ) => set({ animatedFigure: { id, styles } }),
  setKillingFigure: (id: IFigure['id'] | null) => set({ killingFigure: id }),
  setKillingVariants: (variants: IKillVariant[][]) =>
    set({ killingVariants: variants }),
  killFigure: (id: IFigure['id']) => {
    set(state => {
      const figure = state.figures[id]
      const cell = state.cells[figure.cellId]

      delete cell.figureId
      delete state.figures[id]

      return {
        cells: {
          ...state.cells,
          [figure.cellId]: cell
        }
      }
    })
  },
  moveFigure: (startCellId: ICell['id'], finishCellId: ICell['id']) => {
    set(state => {
      const figureId = state.cells[startCellId].figureId

      if (figureId === undefined) {
        return state
      }

      const prevCell = { ...state.cells[startCellId] }
      delete prevCell.figureId

      const newCell = { ...state.cells[finishCellId], figureId }

      const changedFigure = {
        ...state.figures[figureId],
        cellId: finishCellId,
        isStain: makeFigureStain(state.figures[figureId], newCell),
        x: newCell.x,
        y: newCell.y
      }

      return {
        cells: {
          ...state.cells,
          [startCellId]: prevCell,
          [finishCellId]: newCell
        },
        figures: {
          ...state.figures,
          [figureId]: changedFigure
        }
      }
    })
  }
}))
