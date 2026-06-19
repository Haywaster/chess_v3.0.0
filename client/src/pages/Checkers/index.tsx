/* eslint-disable no-console */
import { type FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import styled from 'styled-components'

import {
  type JoinGameRequestWebsocket,
  type JoinGameResponseWebsocket,
  type ErrorResponseWebsocket,
  type GameInfoRequestWebsocket,
  type GameInfoResponseWebsocket,
  ActionType,
  GameMode,
  GameStatus
} from 'entities/Game'
import { LoginForm, UnAuthUserModal, useUsername } from 'features/auth'
import {
  type MoveFigureResponseWebsocket,
  type KillFigureResponseWebsocket,
  useCheckersStore,
  useMoveFigure,
  useUpdateBoard,
  CheckersActionType,
  useResetCheckers
} from 'features/checkers'
import { type id as TId, RouterPath } from 'shared/const/router'
import { useSetWs, useWs } from 'shared/store'
import { Button, Flex } from 'shared/ui'
import { Board } from 'widgets/Board'
import { GameInfo } from 'widgets/GameInfo'
import { CheckersHeader } from 'widgets/Header'

const StyledBoard = styled(Board)`
  margin-top: 15px;
`

const StyledMain = styled.main`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const Checkers: FC = () => {
  const username = useUsername()
  const ws = useWs()
  const setWs = useSetWs()
  const moveAnimate = useMoveFigure()
  const updateBoard = useUpdateBoard()
  const resetCheckers = useResetCheckers()

  const mode = useCheckersStore(state => state.mode)
  const status = useCheckersStore(state => state.status)
  const stepColor = useCheckersStore(state => state.stepColor)
  const setStatus = useCheckersStore(state => state.setStatus)
  const setUserColor = useCheckersStore(state => state.setUserColor)
  const setStepColor = useCheckersStore(state => state.setStepColor)
  const setMode = useCheckersStore(state => state.setMode)
  const killFigure = useCheckersStore(state => state.killFigure)
  const setKillingFigure = useCheckersStore(state => state.setKillingFigure)

  const [isOpenAuthModal, setIsOpenAuthModal] = useState(false)

  const { id } = useParams<typeof TId>()
  const navigate = useNavigate()

  useEffect(() => {
    if (!id || id === 'offline-game') {
      return
    }

    const wss = new WebSocket('/ws')
    setWs(wss)

    const gameInfoData: GameInfoRequestWebsocket = {
      type: CheckersActionType.GAME_INFO,
      data: { id }
    }

    wss.onopen = () => {
      setStatus(GameStatus.PENDING)
      wss.send(JSON.stringify(gameInfoData))
    }

    wss.onmessage = async (event: MessageEvent<string>): Promise<void> => {
      const { data: rawData } = event
      const message = JSON.parse(rawData.toString()) as
        | GameInfoResponseWebsocket
        | JoinGameResponseWebsocket
        | ErrorResponseWebsocket
        | MoveFigureResponseWebsocket
        | KillFigureResponseWebsocket

      switch (message.type) {
        case ActionType.GAME_INFO: {
          const { mode } = message.data

          setMode(mode)

          if (username && mode === GameMode.COUPLE) {
            const joinGameData: JoinGameRequestWebsocket = {
              type: CheckersActionType.JOIN_GAME,
              data: { username, id }
            }

            wss.send(JSON.stringify(joinGameData))
          }

          break
        }
        case ActionType.JOIN_GAME:
          setStatus(message.data.status)
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
        case ActionType.ERROR: {
          if (message.error === 'Game not found') {
            navigate(RouterPath.HOME)
          }
          console.error('WebSocket server error:', message.error)
          break
        }
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
    setMode,
    setKillingFigure,
    navigate
  ])

  useEffect(() => {
    if (id === 'offline-game') {
      setMode(GameMode.OFFLINE)
    }
  }, [id, setMode])

  useEffect(() => {
    return () => {
      resetCheckers()
    }
  }, [resetCheckers])

  const isLoading = status === GameStatus.PENDING && mode === GameMode.COUPLE

  const playUnAuthUser = (): void => {
    if (!ws || !id) {
      return
    }

    const joinGameData: JoinGameRequestWebsocket = {
      type: CheckersActionType.JOIN_GAME,
      data: { username, id }
    }

    ws.send(JSON.stringify(joinGameData))
  }

  return (
    <>
      <CheckersHeader />
      <StyledMain>
        <GameInfo currentMove={stepColor} isLoading={isLoading} />
        <StyledBoard />
      </StyledMain>
      <UnAuthUserModal isOpen={mode === GameMode.COUPLE}>
        {!isOpenAuthModal ? (
          <>
            <p>Пользователь не авторизован. Играть без авторизации?</p>
            <Flex>
              <Button onClick={() => setIsOpenAuthModal(true)}>
                Авторизоваться
              </Button>
              <Button mode="ghost" onClick={playUnAuthUser}>
                Играть
              </Button>
            </Flex>
          </>
        ) : (
          <Flex direction="column">
            <LoginForm />
            <Button onClick={() => setIsOpenAuthModal(false)}>Отмена</Button>
          </Flex>
        )}
      </UnAuthUserModal>
    </>
  )
}
