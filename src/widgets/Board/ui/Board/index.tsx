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

export const Board: FC<IProps> = memo(({ className }) => {
  const cells = useCheckers(state => state.cells)
  const figures = useCheckers(state => state.figures)
  const activeFigure = useCheckers(state => state.activeFigure)
  const setActiveFigure = useCheckers(state => state.setActiveFigure)
  const activeCells = useCheckers(state => state.activeCells)
  const setActiveCells = useCheckers(state => state.setActiveCells)
  const moveFigure = useCheckers(state => state.moveFigure)

  const getActiveCells = useCallback(
    (): ICell['id'][] =>
      Object.values(cells)
        .filter(cell => cell.figureId === undefined && cell.color === 'black')
        .map(cell => cell.id),
    [cells]
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
        setActiveCells(getActiveCells())
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
