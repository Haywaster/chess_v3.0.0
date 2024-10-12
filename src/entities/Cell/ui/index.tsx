import { memo, type FC } from 'react'
import styled from 'styled-components'

import { Figure, type IFigure } from '../../Figure'
import type { ICell } from '../model'

interface IProps extends ICell {
  figure?: IFigure
  isActive?: boolean
  onFigureClick: (id: IFigure['id']) => void
  activeFigure: IFigure['id'] | null
  onCellClick: (id: ICell['id']) => void
}

interface ICellWrapper extends Pick<IProps, 'color'> {
  $isActive: IProps['isActive']
}

const CellWrapper = styled.div<ICellWrapper>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: ${p => p.color};
  cursor: ${p => p.$isActive && 'pointer'};
`

const ActivePoint = styled.div`
  background-color: var(--red);
  border-radius: 50%;
  width: 5px;
  height: 5px;
`

export const Cell: FC<IProps> = memo(props => {
  const {
    isActive,
    figure,
    onFigureClick,
    activeFigure,
    onCellClick,
    ...cell
  } = props

  const handleClick = (): void => {
    if (isActive) {
      onCellClick(cell.id)
    }
  }

  return (
    <CellWrapper $isActive={isActive} color={cell.color} onClick={handleClick}>
      {isActive && <ActivePoint />}
      {figure && (
        <Figure
          onFigureClick={onFigureClick}
          activeFigure={activeFigure}
          {...figure}
        />
      )}
    </CellWrapper>
  )
})
