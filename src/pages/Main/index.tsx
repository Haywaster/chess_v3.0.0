import { type FC } from 'react'
import styled from 'styled-components'

import { CheckersRulesModal } from 'features/checkers'
import { Board } from 'widgets/Board'
import { Header } from 'widgets/Header'

const CenteredBoard = styled(Board)`
  margin: 0 auto;
`

const StyledMain = styled.main`
  margin-top: 30px;
  padding: 0 10px;
`

export const Main: FC = () => {
  return (
    <>
      <Header />
      <StyledMain>
        <CenteredBoard />
      </StyledMain>
      <CheckersRulesModal />
    </>
  )
}
