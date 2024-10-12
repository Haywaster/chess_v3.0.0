import { create } from 'zustand'

import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'
import { initialCells } from 'features/checkers/lib'
import type { IBoard } from 'features/checkers/model'

interface State {
  figures: IBoard['figures']
  cells: IBoard['cells']
  activeFigure: IFigure['id'] | null
  activeCells: ICell['id'][]
  candidateFigures: IFigure['id'][]
}

interface Action {
  reset: () => void
  setActiveFigure: (id: IFigure['id'] | null) => void
  setActiveCells: (cells: ICell['id'][]) => void
}

const initialState: State = {
  ...initialCells,
  activeFigure: null,
  activeCells: [],
  candidateFigures: []
}

export const useCheckers = create<State & Action>(set => ({
  ...initialState,
  reset: () => set({ ...initialState }),
  setActiveFigure: (id: IFigure['id'] | null) => set({ activeFigure: id }),
  setActiveCells: (cells: ICell['id'][]) => set({ activeCells: cells })
}))
