import { memo, type FC, type ReactNode } from 'react'
import styled from 'styled-components'

import type { ICell } from '../model'

interface IProps extends ICell {
  onClick: (id: ICell['id']) => void
  isActive?: boolean
  children?: ReactNode
}

interface ICellWrapper extends Pick<IProps, 'color'> {
  $isActive: IProps['isActive']
}

const CellWrapper = styled.div<ICellWrapper>`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: ${p => p.color};
  cursor: ${p => p.$isActive && 'pointer'};
`

const ActivePoint = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--red);
  border-radius: 50%;
  width: 5px;
  height: 5px;
`

export const Cell: FC<IProps> = memo(props => {
  const { isActive, onClick, children, ...cell } = props

  const handleClick = (): void => {
    if (isActive) {
      onClick(cell.id)
    }
  }

  return (
    <CellWrapper $isActive={isActive} color={cell.color} onClick={handleClick}>
      {isActive && <ActivePoint />}
      {children}
    </CellWrapper>
  )
})
