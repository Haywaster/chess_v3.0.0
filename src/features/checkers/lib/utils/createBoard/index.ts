import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'
import { EVEN_NUMBER } from 'shared/const/numbers'

import type { IBoard } from '../../../model'

const FINAL_WHITE_ROW = 3
const FIRST_ROW_WITHOUT_FIGURES = 4
const SECOND_ROW_WITHOUT_FIGURES = 5
const BOARD_SIZE = 8

export const createBoard = (): IBoard => {
  const cells: ICell[] = []
  const figures: (IFigure | null)[] = []

  let cellIdCounter = 0
  let figureIdCounter = 0

  for (let row = 1; row <= BOARD_SIZE; row++) {
    for (let column = 1; column <= BOARD_SIZE; column++) {
      const createFigure = (): IFigure | null => {
        if (
          row === FIRST_ROW_WITHOUT_FIGURES ||
          row === SECOND_ROW_WITHOUT_FIGURES ||
          (row + column) % EVEN_NUMBER !== 0
        ) {
          return null
        }

        const figure: Omit<IFigure, 'id'> = {
          x: column,
          y: row,
          color: row <= FINAL_WHITE_ROW ? 'white' : 'black',
          isStain: false,
          cellId: cellIdCounter
        }

        return { ...figure, id: figureIdCounter++ }
      }

      const newFigure = createFigure()

      const cell: ICell = {
        id: cellIdCounter++,
        x: column,
        y: row,
        color: (row + column) % EVEN_NUMBER !== 0 ? 'white' : 'black'
      }

      if (newFigure?.id !== undefined) {
        cell.figureId = newFigure.id
      }

      cells.push(cell)
      figures.push(newFigure)
    }
  }

  const newCells = cells.map((cell, index) => ({ ...cell, id: index }))
  const newFigures = figures.filter((figure): figure is IFigure => !!figure)

  return {
    cells: Object.fromEntries(newCells.map(cell => [cell.id, cell])),
    figures: Object.fromEntries(newFigures.map(figure => [figure.id, figure]))
  }
}

export const initialCells = createBoard()

const borders = [1, BOARD_SIZE]

export const boardCellsIds = Object.values(initialCells.cells)
  .filter(cell => borders.includes(cell.x) || borders.includes(cell.y))
  .map(cell => cell.id)
