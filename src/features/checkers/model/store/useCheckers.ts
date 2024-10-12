import { create } from 'zustand'
import { initialCells } from 'features/checkers/lib'
import type { IBoard } from 'features/checkers/model'
import type { IFigure } from 'entities/Figure'
import type { ICell } from 'entities/Cell'

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
  setActiveFigure: (id: IFigure['id'] | null) => set({ activeFigure: id })
}))
