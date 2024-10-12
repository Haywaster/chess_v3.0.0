import { type FC, memo, useCallback } from 'react'
import styled from 'styled-components'

import { Cell, type ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'
import { useCheckers } from 'features/checkers'

const BoardWrapper = styled.div`
  display: grid;
  transform: scale(-1, 1) rotate(180deg);
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  width: 500px;
  height: 500px;
  border: 5px solid var(--black-secondary);
`

interface IProps {
  className?: string
}

const leftDiffCellId = 7
const rightDiffCellId = 9

export const Board: FC<IProps> = memo(({ className }) => {
  const cells = useCheckers(state => state.cells)
  const figures = useCheckers(state => state.figures)
  const activeFigure = useCheckers(state => state.activeFigure)
  const setActiveFigure = useCheckers(state => state.setActiveFigure)
  const activeCells = useCheckers(state => state.activeCells)
  const setActiveCells = useCheckers(state => state.setActiveCells)
  const moveFigure = useCheckers(state => state.moveFigure)

  const getActiveCells = useCallback(
    (activeFigureId: IFigure['id']): ICell['id'][] =>
      Object.values(cells)
        .filter(cell => {
          const activeFigure = figures[activeFigureId]
          const cellDifference = cell.id - activeFigure.cellId

          const isWhiteMoveValid =
            activeFigure.color === 'white' &&
            (cellDifference === leftDiffCellId ||
              cellDifference === rightDiffCellId)

          const isBlackMoveValid =
            activeFigure.color === 'black' &&
            (cellDifference === -leftDiffCellId ||
              cellDifference === -rightDiffCellId)

          const isColorMoveValid = isWhiteMoveValid || isBlackMoveValid

          const isDiagonalMoveValid =
            Math.abs(activeFigure.x - cell.x) ===
            Math.abs(activeFigure.y - cell.y)

          const isStainMoveValid =
            (!activeFigure.isStain && isColorMoveValid) || activeFigure.isStain

          return (
            cell.figureId === undefined &&
            isDiagonalMoveValid &&
            isStainMoveValid
          )
        })
        .map(cell => cell.id),
    [cells, figures]
  )

  const onCellClick = useCallback(
    (id: ICell['id']): void => {
      if (activeFigure) {
        setActiveFigure(null)
        moveFigure(id, activeFigure)
      }
    },
    [activeFigure, moveFigure, setActiveFigure]
  )

  const onFigureClick = useCallback(
    (id: IFigure['id']): void => {
      if (activeFigure === id) {
        setActiveFigure(null)
        setActiveCells([])
      } else {
        setActiveFigure(id)
        setActiveCells(getActiveCells(id))
      }
    },
    [activeFigure, getActiveCells, setActiveCells, setActiveFigure]
  )

  return (
    <BoardWrapper className={className}>
      {Object.values(cells).map(cell => (
        <Cell
          key={cell.id}
          figure={
            cell.figureId !== undefined ? figures[cell.figureId] : undefined
          }
          onFigureClick={onFigureClick}
          activeFigure={activeFigure}
          isActive={activeCells.includes(cell.id) && activeFigure !== null}
          onCellClick={onCellClick}
          {...cell}
        />
      ))}
    </BoardWrapper>
  )
})
