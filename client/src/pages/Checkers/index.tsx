/* eslint-disable no-console */

import { type FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import {
  type JoinGameRequestWebsocket,
  type JoinGameResponseWebsocket,
  GameType,
  type IJoinGameData,
  useGame,
  useSetGame,
  type ErrorResponseWebsocket
} from 'entities/Game'
import { useUsername } from 'entities/User'
import { CheckersRulesModal } from 'features/checkers'
import { UsernameModal } from 'features/prepareToGame'
import type { id as TId } from 'shared/const/router'
import { useSetWs } from 'shared/store'
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
  const setGame = useSetGame()
  const username = useUsername()
  const setWs = useSetWs()

  const { id } = useParams<typeof TId>()

  useEffect(() => {
    const wss = new WebSocket('/ws')
    setWs(wss)

    if (!id || !username) {
      return
    }

    const game: IJoinGameData = {
      username,
      game: { type: GameType.CHECKERS, id }
    }

    const joinGameData: JoinGameRequestWebsocket = {
      data: game,
      type: 'JOIN_GAME'
    }

    wss.onopen = () => {
      wss.send(JSON.stringify(joinGameData))
    }

    wss.onmessage = (event: MessageEvent<string>) => {
      const { data: stringData } = event
      const data = JSON.parse(stringData) as
        | JoinGameResponseWebsocket
        | ErrorResponseWebsocket

      switch (data.type) {
        case 'JOIN_GAME':
          setGame(data.data)
          break
        case 'ERROR':
          console.error('WebSocket server error:', data.error)
          break
        default:
          console.error('Unknown message type')
      }
    }

    return () => {
      wss.close()
      setWs(null)
    }
  }, [id, setGame, setWs, username])

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
