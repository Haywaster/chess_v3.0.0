import { type FC } from 'react'
import styled from 'styled-components'

import { CheckersRulesModal } from 'features/checkers'
import { useSendGameInfo, UsernameModal } from 'features/prepareToGame'
import { Board } from 'widgets/Board'
import { Header } from 'widgets/Header'

const CenteredBoard = styled(Board)`
  margin: 0 auto;
`

const StyledMain = styled.main`
  margin-top: 30px;
`

export const Checkers: FC = () => {
  useSendGameInfo()

  return (
    <>
      <Header />
      <StyledMain>
        <CenteredBoard />
      </StyledMain>
      <CheckersRulesModal />
      <UsernameModal />
    </>
  )
}
