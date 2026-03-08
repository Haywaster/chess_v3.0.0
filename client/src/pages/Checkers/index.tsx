/* eslint-disable no-console */

import { type FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import {
  type JoinGameRequestWebsocket,
  type JoinGameResponseWebsocket,
  type IJoinGameData,
  GameType,
  useGame,
  useSetGame,
  type ErrorResponseWebsocket,
  ActionType
} from 'entities/Game'
import { useUsername } from 'entities/User'
import {
  CheckersRulesModal,
  type MoveFigureResponseWebsocket,
  type SaveGameResponseWebsocket,
  type KillFigureResponseWebsocket,
  useCheckersStore,
  useMoveFigure,
  useUpdateBoard,
  CheckersActionType
} from 'features/checkers'
import { UsernameModal } from 'features/prepareToGame'
import type { id as TId } from 'shared/const/router'
import { useSetWs, useWs } from 'shared/store'
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
  const ws = useWs()
  const setWs = useSetWs()
  const moveAnimate = useMoveFigure()
  const updateBoard = useUpdateBoard()
  const setStepColor = useCheckersStore(state => state.setStepColor)
  const killFigure = useCheckersStore(state => state.killFigure)

  const { id } = useParams<typeof TId>()

  useEffect(() => {
    if (!id || !username) {
      return
    }

    const wss = new WebSocket('/ws')
    setWs(wss)

    const game: IJoinGameData = {
      username,
      game: { type: GameType.CHECKERS, id }
    }

    const joinGameData: JoinGameRequestWebsocket = {
      data: game,
      type: CheckersActionType.JOIN_GAME
    }

    wss.onopen = () => {
      wss.send(JSON.stringify(joinGameData))
    }

    wss.onmessage = async (event: MessageEvent<string>): Promise<void> => {
      const { data: rawData } = event
      const message = JSON.parse(rawData.toString()) as
        | JoinGameResponseWebsocket
        | ErrorResponseWebsocket
        | MoveFigureResponseWebsocket
        | KillFigureResponseWebsocket
        | SaveGameResponseWebsocket

      switch (message.type) {
        case ActionType.JOIN_GAME:
          setGame(message.data)
          break
        case CheckersActionType.MOVE_FIGURE:
          await moveAnimate(message.data.startCell, message.data.finishCell)
          setStepColor(message.data.currentTurn)
          break
        case CheckersActionType.KILL_FIGURE: {
          await moveAnimate(message.data.startCell, message.data.finishCell)
          killFigure(message.data.figureId)
          setStepColor(message.data.currentTurn)
          break
        }
        case ActionType.ERROR:
          console.error('WebSocket server error:', message.error)
          break
        case CheckersActionType.SAVE_GAME:
          updateBoard(message.data)
          break
        default:
          console.error('Unknown message type')
      }
    }

    return () => {
      wss.close()
      setWs(null)
    }
  }, [
    id,
    setGame,
    setWs,
    setStepColor,
    username,
    moveAnimate,
    updateBoard,
    killFigure
  ])

  return (
    <>
      {ws && game?.status === 'pending' && username && <Loader fullScreen />}
      <Header />
      <StyledMain>
        <CenteredBoard />
      </StyledMain>
      <CheckersRulesModal />
      <UsernameModal />
    </>
  )
}
