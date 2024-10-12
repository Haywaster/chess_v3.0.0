import styled from 'styled-components'
import type { IFigure } from '../../Figure'
import { Figure } from '../../Figure'
import type { ICell } from '../model'
import type { FC } from 'react'
import { memo } from 'react'

interface IProps extends ICell {
  figure?: IFigure
  isActive?: boolean
}

export const Cell: FC<IProps> = memo(props => {
  const { isActive, figure, ...cell } = props

  return (
    <CellWrapper isActive={isActive} color={cell.color}>
      {isActive && <ActivePoint />}
      {figure && <Figure {...figure} />}
    </CellWrapper>
  )
})

export const CellWrapper = styled.div<Pick<IProps, 'isActive' | 'color'>>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: ${p => p.color};
  cursor: ${p => p.isActive && 'pointer'};
`

export const ActivePoint = styled.div`
  background-color: var(--red);
  border-radius: 50%;
  width: 5px;
  height: 5px;
`
