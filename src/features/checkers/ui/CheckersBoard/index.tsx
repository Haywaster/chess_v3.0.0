import { type FC, memo } from 'react'

import { type IFigure } from 'entities/Figure'

import { useClick } from '../../lib'
import { useCheckers } from '../../model'
import { CheckersCell } from '../CheckersCell'

export const CheckersBoard: FC = memo(() => {
  const cells = useCheckers(state => state.cells)
  const figures = useCheckers(state => state.figures)

  const { onFigureClick, onCellClick, figureAnimation, animatedFigureId } =
    useClick()

  const hasFigure = (id: IFigure['id'] | undefined): IFigure | undefined => {
    if (id !== undefined) {
      return figures[id]
    }
  }

  return (
    <>
      {Object.values(cells).map(cell => (
        <CheckersCell
          key={cell.id}
          cell={cell}
          onCellClick={onCellClick}
          figure={hasFigure(cell.figureId)}
          onFigureClick={onFigureClick}
          animatedFigureId={animatedFigureId}
          figureAnimation={figureAnimation}
        />
      ))}
    </>
  )
})
