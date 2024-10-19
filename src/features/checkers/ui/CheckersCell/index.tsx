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
  const cellsForMoving = useCheckers(state => state.cellsForMoving)
  const killingVariants = useCheckers(state => state.killingVariants)

  const getAnimatedStyles = (id: IFigure['id']): CSSProperties | undefined => {
    if (id === animatedFigureId) {
      return figureAnimation
    }
  }

  const isActive =
    activeFigure !== null &&
    (cellsForMoving.includes(cell.id) ||
      killingVariants.flat().some(variant => variant.finishCellId === cell.id))

  return (
    <Cell key={cell.id} isActive={isActive} onClick={onCellClick} {...cell}>
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
