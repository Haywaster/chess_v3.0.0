import { type FC, memo } from 'react'

import { type IFigure } from 'entities/Figure'

import { useCellClick, useFigureClick } from '../../lib'
import { type IBoard } from '../../model'
import { useCheckersStore } from '../../store'
import { CheckersCell } from '../CheckersCell'

const getFigure = (
  id: IFigure['id'] | undefined,
  figures: IBoard['figures']
): IFigure | undefined => {
  if (id !== undefined) {
    return figures[id]
  }
}

export const CheckersBoard: FC = memo(() => {
  const cells = useCheckersStore(state => state.cells)
  const figures = useCheckersStore(state => state.figures)

  const onFigureClick = useFigureClick()
  const onCellClick = useCellClick()

  return (
    <>
      {Object.values(cells).map(cell => (
        <CheckersCell
          key={cell.id}
          cell={cell}
          figure={getFigure(cell.figureId, figures)}
          onCellClick={onCellClick}
          onFigureClick={onFigureClick}
        />
      ))}
    </>
  )
})
