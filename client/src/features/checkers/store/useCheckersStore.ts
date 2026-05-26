import { create } from 'zustand'

import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'
import type { TGameMode, TGameStatus } from 'entities/Game'

import { changeBoardAfterKill, changeBoardAfterMove } from '../lib'
import {
  type IBoard,
  type IKillVariant,
  type TRules,
  emptyCells
} from '../model'

import type { CSSProperties } from 'react'

interface State {
  mode: TGameMode | null
  status: TGameStatus | null
  rulesModal: boolean
  rules: Record<TRules, boolean>
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
  stepColor: IFigure['color']
  userColor: IFigure['color'] | null
  requiredFigures: IFigure['id'][]
}

interface Action {
  setMode: (mode: State['mode']) => void
  setStatus: (status: State['status']) => void
  setRules: (rules: State['rules']) => void
  toggleRulesModal: () => void
  reset: () => void
  setActiveFigure: (id: State['activeFigure']) => void
  setCellsForMoving: (cells: State['cellsForMoving']) => void
  setKillingVariants: (variants: State['killingVariants']) => void
  moveFigure: (cellId: ICell['id'], figureId: ICell['id']) => void
  setAnimatedFigure: (
    id: IFigure['id'] | null,
    styles: CSSProperties | undefined
  ) => void
  setKillingFigure: (id: State['killingFigure']) => void
  killFigure: (id: IFigure['id']) => void
  setStepColor: (color: State['stepColor']) => void
  setUserColor: (color: State['userColor']) => void
  setRequiredFigures: (figures: State['requiredFigures']) => void
  updateBoard: (board: IBoard) => void
}

const initialState: State = {
  cells: emptyCells,
  figures: {},
  userColor: null,
  mode: null,
  status: null,
  rules: {} as State['rules'],
  rulesModal: false,
  activeFigure: null,
  cellsForMoving: [], // ячейки для перемещения
  killingVariants: [], // варианты срубки
  requiredFigures: [], // фигуры, которые обязательно должны рубить
  animatedFigure: {
    id: null,
    styles: undefined
  },
  killingFigure: null,
  stepColor: 'white'
}

export const useCheckersStore = create<State & Action>(set => ({
  ...initialState,
  setUserColor: userColor => set({ userColor }),
  setMode: mode => set({ mode }),
  setStatus: status => set({ status }),
  setRules: rules => set({ rules }),
  toggleRulesModal: () => set(state => ({ rulesModal: !state.rulesModal })),
  reset: () => set(initialState),
  setActiveFigure: id => set({ activeFigure: id }),
  setCellsForMoving: cells => set({ cellsForMoving: cells }),
  setAnimatedFigure: (id, styles) => set({ animatedFigure: { id, styles } }),
  setKillingFigure: id => set({ killingFigure: id }),
  setKillingVariants: variants => set({ killingVariants: variants }),
  setStepColor: color => set({ stepColor: color }),
  setRequiredFigures: figures => set({ requiredFigures: figures }),
  killFigure: id => {
    set(state => {
      const board: IBoard = { cells: state.cells, figures: state.figures }
      return changeBoardAfterKill(id, board)
    })
  },
  moveFigure: (startCellId, finishCellId) => {
    set(({ cells, figures }) => {
      const board: IBoard = { cells, figures }
      return changeBoardAfterMove(startCellId, finishCellId, board)
    })
  },
  updateBoard: ({ cells, figures }) => set({ cells, figures })
}))

export const useMoveFigure = (): Action['moveFigure'] =>
  useCheckersStore(state => state.moveFigure)
export const useSetAnimatedFigure = (): Action['setAnimatedFigure'] =>
  useCheckersStore(state => state.setAnimatedFigure)
export const useUpdateBoard = (): Action['updateBoard'] =>
  useCheckersStore(state => state.updateBoard)
export const useResetCheckers = (): Action['reset'] =>
  useCheckersStore(state => state.reset)
