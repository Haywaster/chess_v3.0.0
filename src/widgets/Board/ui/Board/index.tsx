import { type FC, memo } from 'react'
import styled from 'styled-components'

import { CheckersBoard } from 'features/checkers'

const BoardWrapper = styled.div`
  display: grid;
  transform: scale(-1, 1) rotate(180deg);
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  width: 500px;
  height: 500px;
  border: 5px solid var(--black-secondary);
`

interface IProps {
  className?: string
}

export const Board: FC<IProps> = memo(({ className }) => {
  return (
    <BoardWrapper className={className}>
      <CheckersBoard />
    </BoardWrapper>
  )
})
