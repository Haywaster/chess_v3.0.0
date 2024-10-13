import { type CSSProperties, type FC, memo } from 'react'

import { Cell, type ICell } from 'entities/Cell'
import { Figure, type IFigure } from 'entities/Figure'

import { useCheckers } from '../../model'

interface IProps {
  onCellClick: (id: ICell['id']) => void
  onFigureClick: (id: IFigure['id']) => void
  cell: ICell
  figure?: IFigure
  animatedFigureId: IFigure['id'] | null
  figureAnimation: CSSProperties | undefined
}

export const CheckersCell: FC<IProps> = memo(props => {
  const {
    onCellClick,
    onFigureClick,
    cell,
    figure,
    animatedFigureId,
    figureAnimation
  } = props

  const activeFigure = useCheckers(state => state.activeFigure)
  const activeCells = useCheckers(state => state.activeCells)

  const getAnimatedStyles = (id: IFigure['id']): CSSProperties | undefined => {
    if (id === animatedFigureId) {
      return figureAnimation
    }
  }

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
          style={getAnimatedStyles(figure.id)}
          {...figure}
        />
      )}
    </Cell>
  )
})
