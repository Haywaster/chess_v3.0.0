import { type FC, memo } from 'react'
import styled, { css } from 'styled-components'

import { OrderCellWrapper } from '../OrderCellWrapper'

const verticalCells = Array.from({ length: 8 }, (_, i) => String(i + 1))

interface IStyledProps {
  $isRotate?: boolean
}

const VerticalOrderStyled = styled(OrderCellWrapper)<IStyledProps>`
  flex-direction: column-reverse;
  padding: 5px 0;
  width: 60px;

  ${p =>
    p.$isRotate &&
    css`
      flex-direction: column;
    `}
`

interface IProps {
  isRotate?: boolean
}

export const VerticalOrder: FC<IProps> = memo(({ isRotate }) => {
  return <VerticalOrderStyled $isRotate={isRotate} values={verticalCells} />
})
