import { type FC } from 'react'
import styled from 'styled-components'

import { GameType, useGame } from 'entities/Game'
import { useUsername } from 'entities/User'
import { CheckersRulesModal } from 'features/checkers'
import { UsernameModal } from 'features/prepareToGame'
import { useGameInfo } from 'features/prepareToGame/lib'
import { useWebSocketConnection } from 'shared/lib'
import { Loader } from 'shared/ui'
import { Board } from 'widgets/Board'
import { Header } from 'widgets/Header'

const CenteredBoard = styled(Board)`
  margin: 0 auto;
`

const StyledMain = styled.main`
  margin-top: 30px;
`

export const Checkers: FC = () => {
  const game = useGame()
  const username = useUsername()

  useWebSocketConnection('/ws')
  useGameInfo(GameType.CHECKERS)

  return (
    <>
      {game?.status === 'pending' && username && <Loader fullScreen />}
      <Header />
      <StyledMain>
        <CenteredBoard />
      </StyledMain>
      <CheckersRulesModal />
      <UsernameModal />
    </>
  )
}
