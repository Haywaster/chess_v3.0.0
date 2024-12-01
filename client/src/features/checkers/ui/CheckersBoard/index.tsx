import { type FC, memo } from 'react'

import { type IFigure } from 'entities/Figure'

import { useCellClick, useFigureClick } from '../../lib'
import { useCheckers } from '../../model'
import { CheckersCell } from '../CheckersCell'

export const CheckersBoard: FC = memo(() => {
  const cells = useCheckers(state => state.cells)
  const figures = useCheckers(state => state.figures)

  const onFigureClick = useFigureClick()
  const onCellClick = useCellClick()

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
          figure={hasFigure(cell.figureId)}
          onCellClick={onCellClick}
          onFigureClick={onFigureClick}
        />
      ))}
    </>
  )
})
