import { type FC } from 'react'
import styled from 'styled-components'

import { useGame } from 'entities/Game'
import { useUsername } from 'entities/User'
import { CheckersRulesModal } from 'features/checkers'
import { useSendGameInfo, UsernameModal } from 'features/prepareToGame'
import { Loader } from 'shared/ui'
import { Board } from 'widgets/Board'
import { Header } from 'widgets/Header'
import { useWebSocketSubscription } from 'shared/lib/hooks/websocket/useWebSocketSubscription.ts'

const CenteredBoard = styled(Board)`
  margin: 0 auto;
`

const StyledMain = styled.main`
  margin-top: 30px;
`

export const Checkers: FC = () => {
  const game = useGame()
  const username = useUsername()

  // useSendGameInfo()
  useWebSocketSubscription('checkers', (message) => {
    if (message.type === 'notification') {
      const newNotification = {
        id: message.data.id,
        message: message.data.message,
        priority: message.data.priority,
        timestamp: Date.now(),
        read: false
      };
      console.log(newNotification)
    }
  })

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
