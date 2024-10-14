import { create } from 'zustand'

import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'
import { initialCells } from 'features/checkers/lib'
import type { IBoard } from 'features/checkers/model'
import type { IKillVariant } from 'features/checkers/model/types'

interface State {
  figures: IBoard['figures']
  cells: IBoard['cells']
  activeFigure: IFigure['id'] | null
  cellsForMoving: ICell['id'][]
  killingVariants: IKillVariant[]
}

interface Action {
  reset: () => void
  setActiveFigure: (id: IFigure['id'] | null) => void
  setCellsForMoving: (cells: ICell['id'][]) => void
  setKillingVariants: (variants: IKillVariant[]) => void
  moveFigure: (cellId: ICell['id'], figureId: ICell['id']) => void
}

const initialState: State = {
  ...initialCells,
  activeFigure: null,
  cellsForMoving: [], // ячейки для перемещения
  killingVariants: [] // варианты срубки
}

export const useCheckers = create<State & Action>(set => ({
  ...initialState,
  reset: () => set({ ...initialState }),
  setActiveFigure: (id: IFigure['id'] | null) => set({ activeFigure: id }),
  setCellsForMoving: (cells: ICell['id'][]) => set({ cellsForMoving: cells }),
  moveFigure: (cellId: ICell['id'], figureId: ICell['id']) => {
    set(state => {
      const prevCellId = state.figures[figureId].cellId

      const prevCell = {
        ...state.cells[prevCellId]
      }
      delete prevCell.figureId

      const newCell = {
        ...state.cells[cellId],
        figureId
      }

      const changedFigure = {
        ...state.figures[figureId],
        cellId,
        x: state.cells[cellId].x,
        y: state.cells[cellId].y
      }

      return {
        ...state,
        cells: {
          ...state.cells,
          [prevCellId]: prevCell,
          [cellId]: newCell
        },
        figures: {
          ...state.figures,
          [figureId]: changedFigure
        }
      }
    })
  },
  setKillingVariants: (variants: IKillVariant[]) =>
    set({ killingVariants: variants })
}))
