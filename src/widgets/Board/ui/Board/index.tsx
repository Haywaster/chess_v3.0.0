import { type FC, memo } from 'react'
import styled from 'styled-components'

import { Cell } from 'entities/Cell'
import { Figure, type IFigure } from 'entities/Figure'
import { useCheckers } from 'features/checkers'
import { useClick } from 'features/checkers/lib/hooks'

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
  const activeCells = useCheckers(state => state.activeCells)

  const { onFigureClick, onCellClick, figureAnimation, animatedFigureId } =
    useClick()

  const hasFigure = (id: IFigure['id'] | undefined): IFigure | undefined => {
    if (id !== undefined) {
      return figures[id]
    }
  }

  return (
    <BoardWrapper className={className}>
      {Object.values(cells).map(cell => {
        const figure = hasFigure(cell.figureId)

        return (
          <Cell
            key={cell.id}
            isActive={activeCells.includes(cell.id) && activeFigure !== null}
            onClick={onCellClick}
            {...cell}
          >
            {figure && (
              <Figure
                onClick={onFigureClick}
                activeFigure={activeFigure}
                style={
                  figure.id === animatedFigureId ? figureAnimation : undefined
                }
                {...figure}
              />
            )}
          </Cell>
        )
      })}
    </BoardWrapper>
  )
})
