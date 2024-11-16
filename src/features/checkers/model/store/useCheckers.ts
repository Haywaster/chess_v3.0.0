import type { CSSProperties } from 'react'
import { create } from 'zustand'

import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'
import { killFigureFromBoard } from 'features/checkers/lib/utils/killFigureFromBoard'

import { initialCells, ruleDefaults } from '../../const'
import { changeBoardAfterMove } from '../../lib'
import type { IBoard, IKillVariant, Rules } from '../types'

interface State {
  rulesModal: boolean
  rules: Record<Rules, boolean>
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
  stepColor: IFigure['color'] | null
  requiredFigures: IFigure['id'][]
}

interface Action {
  changeRule: (rule: Rules, value: boolean) => void
  toggleRulesModal: () => void
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
  setStepColor: (color: IFigure['color'] | null) => void
  setRequiredFigures: (figures: IFigure['id'][]) => void
}

const initialState: State = {
  ...initialCells,
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

export const useCheckers = create<State & Action>(set => ({
  ...initialState,
  changeRule: (rule, value) =>
    set(state => ({ rules: { ...state.rules, [rule]: value } })),
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
      return {
        cells: killFigureFromBoard(id, board)
      }
    })
  },
  moveFigure: (startCellId, finishCellId) => {
    set(state => {
      const board: IBoard = { cells: state.cells, figures: state.figures }
      return changeBoardAfterMove(startCellId, finishCellId, board)
    })
  }
}))
