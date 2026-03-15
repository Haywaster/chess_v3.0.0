import type { CSSProperties } from 'react'
import { create } from 'zustand'

import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'
import type { IBaseGame, TGameMode } from 'entities/Game'

import { changeBoardAfterKill, changeBoardAfterMove } from '../lib'
import {
  initialCells,
  ruleDefaults,
  type IBoard,
  type IKillVariant,
  type TRules
} from '../model'

interface State {
  mode: TGameMode | null
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
  cooperativeGameData: IBaseGame | null // null в mode: SINGLE
}

interface Action {
  setCooperativeGameData: (gameData: State['cooperativeGameData']) => void
  setMode: (mode: TGameMode) => void
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
  ...initialCells,
  cooperativeGameData: null,
  userColor: null,
  mode: null,
  rules: ruleDefaults,
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
  //  Если к-л кооперативные данные существуют, они перезапишутся, иначе обнулятся
  setCooperativeGameData: gameData =>
    set(state => {
      if (gameData) {
        return {
          cooperativeGameData: { ...state.cooperativeGameData, ...gameData }
        }
      }

      return { cooperativeGameData: null }
    }),
  setUserColor: color => set({ userColor: color }),
  setMode: mode => set({ mode }),
  setRules: rules => set({ rules }),
  toggleRulesModal: () => set(state => ({ rulesModal: !state.rulesModal })),
  reset: () => set({ ...initialState }),
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
    set(state => {
      const board: IBoard = { cells: state.cells, figures: state.figures }
      return changeBoardAfterMove(startCellId, finishCellId, board)
    })
  },
  updateBoard: board => set({ cells: board.cells, figures: board.figures })
}))

export const useMoveFigure = (): Action['moveFigure'] =>
  useCheckersStore(state => state.moveFigure)
export const useSetAnimatedFigure = (): Action['setAnimatedFigure'] =>
  useCheckersStore(state => state.setAnimatedFigure)
export const useUpdateBoard = (): Action['updateBoard'] =>
  useCheckersStore(state => state.updateBoard)
