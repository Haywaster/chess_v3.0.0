import { type CSSProperties, type FC, memo } from 'react'

import { Cell, type ICell } from 'entities/Cell'
import { Figure, type IFigure } from 'entities/Figure'

import { useCheckers } from '../../store'

interface IProps {
  onCellClick: (id: ICell['id']) => void
  onFigureClick: (id: IFigure['id']) => void
  cell: ICell
  figure?: IFigure
}

export const CheckersCell: FC<IProps> = memo(props => {
  const { onCellClick, onFigureClick, cell, figure } = props

  const activeFigure = useCheckers(state => state.activeFigure)
  const cellsForMoving = useCheckers(state => state.cellsForMoving)
  const killingVariants = useCheckers(state => state.killingVariants)
  const animatedFigure = useCheckers(state => state.animatedFigure)
  const killingFigure = useCheckers(state => state.killingFigure)
  const requiredFigures = useCheckers(state => state.requiredFigures)

  const getAnimatedStyles = (id: IFigure['id']): CSSProperties | undefined => {
    if (id === animatedFigure.id) {
      return animatedFigure.styles
    }
  }

  const isActive =
    activeFigure !== null &&
    (cellsForMoving.includes(cell.id) ||
      killingVariants.some(v => v[v.length - 1].finishCellId === cell.id))

  const isWayCell =
    activeFigure !== null &&
    !isActive &&
    killingVariants.some(variant =>
      variant.slice(0, -1).some(v => v.finishCellId === cell.id)
    )

  return (
    <Cell
      key={cell.id}
      isActive={isActive}
      isWayCell={isWayCell}
      onClick={onCellClick}
      {...cell}
    >
      {figure && (
        <Figure
          activeFigure={activeFigure}
          isKilling={killingFigure === figure.id}
          isRequired={requiredFigures.includes(figure.id)}
          style={getAnimatedStyles(figure.id)}
          onClick={onFigureClick}
          {...figure}
        />
      )}
    </Cell>
  )
})
