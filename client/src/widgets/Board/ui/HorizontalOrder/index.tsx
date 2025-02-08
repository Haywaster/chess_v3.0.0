import { type FC, memo } from 'react'
import styled, { css } from 'styled-components'

import { CHAR_CODE } from 'shared/const/numbers'

import { OrderCellWrapper } from '../OrderCellWrapper'

const horizontalCells = Array.from({ length: 8 }, (_, i) =>
  String.fromCharCode(CHAR_CODE + i)
)

interface IStyledProps {
  $isRotate?: boolean
}

const HorizontalOrderStyled = styled(OrderCellWrapper)<IStyledProps>`
  grid-area: 2 / 2 / 3 / 3;
  padding: 0 5px;
  height: 60px;

  ${p =>
    p.$isRotate &&
    css`
      flex-direction: row-reverse;
    `}
`

interface IProps {
  isRotate?: boolean
}

export const HorizontalOrder: FC<IProps> = memo(({ isRotate }) => {
  return <HorizontalOrderStyled $isRotate={isRotate} values={horizontalCells} />
})
