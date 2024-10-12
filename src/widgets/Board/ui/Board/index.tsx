import { useCheckers } from 'features/checkers/model'
import { Cell } from 'entities/Cell'
import styled from 'styled-components'
import type { FC } from 'react'
import { memo } from 'react'
import type { IFigure } from 'entities/Figure'

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

  const findFigure = (x: number, y: number): IFigure | undefined =>
    Object.values(figures).find(figure => figure.x === x && figure.y === y)

  return (
    <BoardWrapper className={className}>
      {Object.values(cells).map(cell => (
        <Cell key={cell.id} {...cell} figure={findFigure(cell.x, cell.y)} />
      ))}
    </BoardWrapper>
  )
})
