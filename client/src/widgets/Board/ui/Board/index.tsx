import { type FC, memo } from 'react'
import styled from 'styled-components'

import { CheckersBoard, useCheckers } from 'features/checkers'
import { useRotateBoard } from 'features/rotateBoard'

import { HorizontalOrder } from '../HorizontalOrder'
import { VerticalOrder } from '../VerticalOrder'

const MainBoard = styled.div`
  display: grid;
  grid-template: repeat(2, min-content) / repeat(2, min-content);
  justify-content: center;
`

interface IBoardWrapperProps {
  className?: string
  $isRotate?: boolean
}

const BoardWrapper = styled.div<IBoardWrapperProps>`
  display: grid;
  transform: scale(1, -1);
  grid-template: repeat(8, 1fr) / repeat(8, 1fr);
  width: 500px;
  height: 500px;
  border: 5px solid var(--border-color);
  rotate: ${p => p.$isRotate && '-180deg'};
  transition: rotate 1s ease;
`

interface IProps {
  className?: string
}

export const Board: FC<IProps> = memo(({ className }) => {
  const stepColor = useCheckers(state => state.stepColor)
  const rotate = useRotateBoard(state => state.rotate)

  const isRotate = rotate && stepColor === 'black'

  return (
    <MainBoard>
      <VerticalOrder isRotate={isRotate} />
      <BoardWrapper $isRotate={isRotate} className={className}>
        <CheckersBoard />
      </BoardWrapper>
      <HorizontalOrder isRotate={isRotate} />
    </MainBoard>
  )
})
