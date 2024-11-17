import { type FC, memo } from 'react'
import styled from 'styled-components'

import { CheckersBoard, useCheckers } from 'features/checkers'
import { useRotateBoard } from 'features/rotateBoard/model'

interface IBoardWrapperProps {
  className?: string
  $rotate?: boolean
}

const BoardWrapper = styled.div<IBoardWrapperProps>`
  display: grid;
  transform: scale(1, -1);
  grid-template: repeat(8, 1fr) / repeat(8, 1fr);
  width: 500px;
  height: 500px;
  border: 5px solid var(--border-color);
  rotate: ${p => p.$rotate && '-180deg'};
  transition: rotate 1s ease;
`

interface IProps {
  className?: string
}

export const Board: FC<IProps> = memo(({ className }) => {
  const stepColor = useCheckers(state => state.stepColor)
  const rotate = useRotateBoard(state => state.rotate)

  return (
    <BoardWrapper
      className={className}
      $rotate={rotate && stepColor === 'black'}
    >
      <CheckersBoard />
    </BoardWrapper>
  )
})
