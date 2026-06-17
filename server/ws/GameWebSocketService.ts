/* eslint-disable no-console */

import { type Server } from 'http'

import { type RawData, WebSocket, WebSocketServer } from 'ws'

import {
  type IFigure,
  type JoinGameRequestWebsocket,
  type MoveFigureRequestWebsocket,
  type KillFigureRequestWebsocket,
  CheckersActionType,
  initialBoard,
  changeBoardAfterMove,
  changeBoardAfterKill,
  type IBoard,
  type GameInfoRequestWebsocket
} from '@game-workspace/checkers'
import {
  GameStatus,
  type IGeneralGame,
  type TGameStatus
} from '@game-workspace/shared'

import prisma from '../prisma/prismaClient'

type IncomingWebsocketMessage =
  | GameInfoRequestWebsocket
  | JoinGameRequestWebsocket
  | MoveFigureRequestWebsocket
  | KillFigureRequestWebsocket

interface IConnectionState {
  gameId: string
  userId: number
  username: string
  color: IFigure['color']
}

class GameWebSocketService {
  private readonly wss: WebSocketServer
  private readonly gameRooms = new Map<IGeneralGame['id'], Set<WebSocket>>()
  private readonly connectionState = new Map<
    WebSocket,
    IConnectionState | null
  >()

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server })
    this.initializeHandlers()
  }

  private initializeHandlers(): void {
    this.wss.on('connection', ws => {
      this.connectionState.set(ws, null)
      console.log('New WebSocket connection')

      ws.on('message', (rawData: RawData) => {
        void (async () => {
          try {
            const message = JSON.parse(
              rawData.toString()
            ) as IncomingWebsocketMessage
            await this.handleMessage(ws, message)
          } catch (error) {
            console.error('Failed to parse message:', error)
            this.sendError(ws, 'Invalid message')
          }
        })()
      })

      ws.on('close', () => {
        this.handleDisconnect(ws)
        console.log('WebSocket disconnected')
      })

      ws.on('error', error => {
        console.error('WebSocket error:', error)
      })
    })
  }

  private async handleMessage(
    ws: WebSocket,
    message: IncomingWebsocketMessage
  ): Promise<void> {
    switch (message.type) {
      case CheckersActionType.GAME_INFO:
        await this.gameInfo(ws, message.data)
        break
      case CheckersActionType.JOIN_GAME:
        await this.joinGame(ws, message.data)
        break
      case CheckersActionType.MOVE_FIGURE:
        await this.moveFigure(ws, message.data)
        break
      case CheckersActionType.KILL_FIGURE:
        await this.killFigure(ws, message.data)
        break
      default:
        this.sendError(ws, 'Unknown message type')
    }
  }

  private async gameInfo(
    ws: WebSocket,
    message: GameInfoRequestWebsocket['data']
  ): Promise<void> {
    const { id: gameId } = message
    const checkersGame = await prisma.checkersGame.findUnique({
      where: { gameId }
    })

    if (!checkersGame) {
      return this.sendError(ws, 'Game not found')
    }

    const { mode } = checkersGame

    this.sendJson(ws, {
      type: CheckersActionType.GAME_INFO,
      data: { mode }
    })
  }

  private async joinGame(
    ws: WebSocket,
    message: JoinGameRequestWebsocket['data']
  ): Promise<void> {
    // Общая логика
    const { username, id: gameId } = message
    const gameInDB = await prisma.game.findUnique({ where: { id: gameId } })

    if (!gameInDB) {
      return this.sendError(ws, 'Game not found')
    }

    const currentUser = await prisma.user.findUnique({
      where: { login: username }
    })

    if (!currentUser) {
      return this.sendError(ws, 'User not found')
    }

    const gameType = await prisma.gameType.findUnique({
      where: { id: gameInDB.gameTypeId }
    })

    if (!gameType) {
      return this.sendError(ws, "Game type doesn't exist")
    }

    const participant = await prisma.gameParticipant.findUnique({
      where: { gameId_playerId: { gameId, playerId: currentUser.id } }
    })

    const gameParticipants = await prisma.gameParticipant.findMany({
      where: { gameId }
    })

    // Игрок не найден
    if (!participant) {
      // Игрок залетел в пустую существующую комнату
      if (!gameParticipants.length) {
        return this.sendError(ws, 'Empty room')
      }
      // Игрок не найден по причине максимума игроков в игре (3-й лишний)
      if (
        gameType.maxPlayers &&
        gameParticipants.length >= gameType.maxPlayers
      ) {
        return this.sendError(ws, 'Game is already full')
      }
      // Добавляем игрока в игру
      const { id: firstParticipantId } = gameParticipants[0]

      const firstParticipantColor =
        await prisma.gameWithColorParticipant.findUnique({
          where: { participantId: firstParticipantId }
        })

      if (!firstParticipantColor) {
        return this.sendError(ws, 'First participant color not found')
      }

      const participantColor =
        firstParticipantColor.color === 'white'
          ? 'black'
          : ('white' as IFigure['color'])

      await prisma.gameParticipant.create({
        data: {
          gameId,
          playerId: currentUser.id,
          colorParticipant: {
            create: {
              color: participantColor
            }
          }
        }
      })

      await prisma.game.update({
        where: { id: gameId },
        data: { status: GameStatus.PLAYING }
      })

      this.attachClientToGame(ws, gameId, {
        userId: currentUser.id,
        username,
        color: participantColor
      })

      this.broadcastJoinState(gameId, GameStatus.PLAYING)
      // Игрок найден
    } else {
      const participantWithColor =
        await prisma.gameWithColorParticipant.findUnique({
          where: { participantId: participant.id }
        })

      if (!participantWithColor) {
        return this.sendError(ws, 'Participant with color not found')
      }

      this.attachClientToGame(ws, gameId, {
        userId: currentUser.id,
        username,
        color: participantWithColor.color as IFigure['color']
      })

      const gameRoom = this.gameRooms.get(gameId)

      if (!gameRoom) {
        return this.sendError(ws, 'Game not found')
      }

      // Игрок отключился от игры, но подключился заново
      if (
        gameType.maxPlayers &&
        gameRoom.size >= gameType.maxPlayers &&
        gameInDB.status === GameStatus.PENDING
      ) {
        await prisma.game.update({
          where: { id: gameId },
          data: { status: GameStatus.PLAYING }
        })

        this.broadcastJoinState(gameId, GameStatus.PLAYING)
      } else {
        this.sendJoinState(ws, gameInDB.status as TGameStatus)
      }
    }
  }

  private async moveFigure(
    ws: WebSocket,
    message: MoveFigureRequestWebsocket['data']
  ): Promise<void> {
    const { startCell, finishCell } = message
    const connection = this.connectionState.get(ws)

    if (!connection) {
      return this.sendError(ws, 'Socket is not connected to this game')
    }

    const { gameId } = connection

    const currentCheckersGame = await prisma.checkersGame.findUnique({
      where: { gameId }
    })

    if (!currentCheckersGame) {
      return this.sendError(ws, 'Game not found')
    }

    const { board, currentTurn } = currentCheckersGame

    const typedBoard = (
      typeof board === 'string' ? JSON.parse(board) : null
    ) as IBoard | null

    if (!typedBoard) {
      return this.sendError(ws, 'Board not found')
    }

    const boardAfterMove = changeBoardAfterMove(
      startCell.id,
      finishCell.id,
      typedBoard
    )

    const updatedCheckersGame = await prisma.checkersGame.update({
      where: { gameId },
      data: {
        currentTurn: currentTurn === 'white' ? 'black' : 'white',
        board: JSON.stringify(boardAfterMove)
      }
    })

    this.broadcastToRoom(gameId, {
      type: CheckersActionType.MOVE_FIGURE,
      data: {
        startCell,
        finishCell,
        currentTurn: updatedCheckersGame.currentTurn
      }
    })
  }

  private async killFigure(
    ws: WebSocket,
    message: KillFigureRequestWebsocket['data']
  ): Promise<void> {
    const { startCell, finishCell, figureId } = message
    const connection = this.connectionState.get(ws)

    if (!connection) {
      return this.sendError(ws, 'Socket is not connected to this game')
    }

    const { gameId } = connection

    const currentCheckersGame = await prisma.checkersGame.findUnique({
      where: { gameId }
    })

    if (!currentCheckersGame) {
      return this.sendError(ws, 'Game not found')
    }

    const { currentTurn, board } = currentCheckersGame

    const typedBoard = (
      typeof board === 'string' ? JSON.parse(board) : null
    ) as IBoard | null

    if (!typedBoard) {
      return this.sendError(ws, 'Board not found')
    }

    const boardAfterMove = changeBoardAfterMove(
      startCell.id,
      finishCell.id,
      typedBoard
    )

    const boardAfterKill = changeBoardAfterKill(figureId, boardAfterMove)

    const updatedCheckersGame = await prisma.checkersGame.update({
      where: { gameId },
      data: {
        currentTurn: currentTurn === 'white' ? 'black' : 'white',
        board: JSON.stringify(boardAfterKill)
      }
    })

    this.broadcastToRoom(gameId, {
      type: CheckersActionType.KILL_FIGURE,
      data: {
        figureId,
        startCell,
        finishCell,
        currentTurn: updatedCheckersGame.currentTurn
      }
    })
  }

  private attachClientToGame(
    ws: WebSocket,
    gameId: string,
    params: Omit<IConnectionState, 'gameId'>
  ): void {
    this.detachClientFromGame(ws)

    const room = this.gameRooms.get(gameId) ?? new Set<WebSocket>()
    room.add(ws)
    this.gameRooms.set(gameId, room)
    this.connectionState.set(ws, { gameId, ...params })
  }

  private detachClientFromGame(ws: WebSocket): void {
    const connection = this.connectionState.get(ws)

    if (!connection?.gameId) {
      return
    }

    const room = this.gameRooms.get(connection.gameId)

    if (!room) {
      return
    }

    room.delete(ws)

    if (room.size === 0) {
      this.connectionState.delete(ws)
    }
  }

  private async handleDisconnect(ws: WebSocket): Promise<void> {
    const connection = this.connectionState.get(ws)

    if (!connection?.gameId) {
      return
    }

    await prisma.game.update({
      where: { id: connection.gameId },
      data: { status: GameStatus.PENDING }
    })

    this.broadcastJoinState(connection.gameId, GameStatus.PENDING, ws)
    this.detachClientFromGame(ws)
    this.connectionState.delete(ws)
  }

  private async broadcastJoinState(
    gameId: string,
    status: TGameStatus,
    excludeWs?: WebSocket
  ): Promise<void> {
    const room = this.gameRooms.get(gameId)

    if (!room) {
      return
    }

    room.forEach(client => {
      if (client !== excludeWs) {
        this.sendJoinState(client, status)
      }
    })
  }

  private async sendJoinState(
    ws: WebSocket,
    status: TGameStatus
  ): Promise<void> {
    const checkersGameGeneralData = this.connectionState.get(ws)

    if (!checkersGameGeneralData) {
      return this.sendError(ws, 'Game not found')
    }

    const { gameId, color: userColor } = checkersGameGeneralData

    const checkersGameDB = await prisma.checkersGame.findUnique({
      where: { gameId }
    })

    if (!checkersGameDB) {
      return this.sendError(ws, 'Game not found')
    }

    const { currentTurn, board } = checkersGameDB

    this.sendJson(ws, {
      type: CheckersActionType.JOIN_GAME,
      data: {
        status,
        board: typeof board === 'string' ? JSON.parse(board) : initialBoard,
        userColor,
        currentTurn
      }
    })
  }

  private broadcastToRoom(
    gameId: string,
    message: Record<string, unknown>,
    excludeWs?: WebSocket
  ): void {
    const room = this.gameRooms.get(gameId)

    if (!room) {
      return
    }

    room.forEach(client => {
      if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
        this.sendJson(client, message)
      }
    })
  }

  private sendError(ws: WebSocket, error: string): void {
    this.sendJson(ws, { type: CheckersActionType.ERROR, error })
  }

  private sendJson(ws: WebSocket, payload: Record<string, unknown>): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload))
    }
  }
}

export default GameWebSocketService
