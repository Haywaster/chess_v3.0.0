/* eslint-disable no-console */
import { type FC, useEffect } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'

import {
  type JoinGameRequestWebsocket,
  type JoinGameResponseWebsocket,
  type ErrorResponseWebsocket,
  ActionType,
  GameMode,
  GameStatus
} from 'entities/Game'
import { useUsername } from 'entities/User'
import {
  type MoveFigureResponseWebsocket,
  type KillFigureResponseWebsocket,
  useCheckersStore,
  useMoveFigure,
  useUpdateBoard,
  CheckersActionType
} from 'features/checkers'
import type { id as TId } from 'shared/const/router'
import { useSetWs } from 'shared/store'
import { Loader } from 'shared/ui'
import { Board } from 'widgets/Board'
import { CheckersHeader } from 'widgets/Header'

const CenteredBoard = styled(Board)`
  margin: 0 auto;
`

const StyledMain = styled.main`
  margin-top: 30px;
`

export const Checkers: FC = () => {
  const username = useUsername()
  const setWs = useSetWs()
  const moveAnimate = useMoveFigure()
  const updateBoard = useUpdateBoard()

  const mode = useCheckersStore(state => state.mode)
  const status = useCheckersStore(state => state.status)
  const setStatus = useCheckersStore(state => state.setStatus)
  const setUserColor = useCheckersStore(state => state.setUserColor)
  const setStepColor = useCheckersStore(state => state.setStepColor)
  const setMode = useCheckersStore(state => state.setMode)
  const killFigure = useCheckersStore(state => state.killFigure)
  const setKillingFigure = useCheckersStore(state => state.setKillingFigure)

  const { id } = useParams<typeof TId>()

  useEffect(() => {
    if (!id || !username || id === 'offline-game') {
      return
    }

    const wss = new WebSocket('/ws')
    setWs(wss)

    const joinGameData: JoinGameRequestWebsocket = {
      type: CheckersActionType.JOIN_GAME,
      data: { username, id }
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

      switch (message.type) {
        case ActionType.JOIN_GAME:
          setStatus(message.data.status)
          setMode(message.data.mode)
          setUserColor(message.data.userColor)
          setStepColor(message.data.currentTurn)
          updateBoard(message.data.board)
          break
        case CheckersActionType.MOVE_FIGURE:
          await moveAnimate(message.data.startCell, message.data.finishCell)
          setStepColor(message.data.currentTurn)
          break
        case CheckersActionType.KILL_FIGURE: {
          await moveAnimate(message.data.startCell, message.data.finishCell)
          killFigure(message.data.figureId)
          setKillingFigure(null)
          setStepColor(message.data.currentTurn)
          break
        }
        case ActionType.ERROR:
          console.error('WebSocket server error:', message.error)
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
    setWs,
    setStepColor,
    username,
    moveAnimate,
    updateBoard,
    killFigure,
    setUserColor,
    setStatus,
    setMode
  ])

  useEffect(() => {
    if (id === 'offline-game') {
      setMode(GameMode.OFFLINE)
    }
  }, [id, setMode])

  const isLoading = status === GameStatus.PENDING && mode === GameMode.COUPLE

  return (
    <>
      {isLoading && <Loader fullScreen />}
      <CheckersHeader />
      <StyledMain>{!isLoading && <CenteredBoard />}</StyledMain>
      {/*<UsernameModal />*/}
    </>
  )
}
