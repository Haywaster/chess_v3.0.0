import { memo, type FC, type ReactNode, type KeyboardEventHandler } from 'react'
import styled, { css } from 'styled-components'

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

  ${p =>
    p.$isActive &&
    css`
      cursor: pointer;

      &:focus-visible {
        border: 3px dashed var(--white);
      }
    `}
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

  const handlerEnterDown: KeyboardEventHandler<HTMLDivElement> | undefined = (
    e
  ): void => {
    if (e.key === 'Enter') {
      handleClick()
    }
  }

  return (
    <CellWrapper
      tabIndex={isActive ? 0 : undefined}
      role={isActive ? 'button' : undefined}
      $isActive={isActive}
      color={cell.color}
      onClick={handleClick}
      onKeyDown={handlerEnterDown}
    >
      {isActive && <ActivePoint />}
      {children}
    </CellWrapper>
  )
})
