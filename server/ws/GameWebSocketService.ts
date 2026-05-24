/* eslint-disable no-console */

import { type Server } from 'http'

import { type RawData, WebSocket, WebSocketServer } from 'ws'

import {
  type IFigure,
  type JoinGameRequestWebsocket,
  type MoveFigureRequestWebsocket,
  type KillFigureRequestWebsocket,
  CheckersActionType
} from '@game-workspace/checkers'
import {
  GameStatus,
  type IGeneralGame,
  type TGameStatus
} from '@game-workspace/shared'

import prisma from '../prisma/prismaClient'

type IncomingWebsocketMessage =
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
      case CheckersActionType.JOIN_GAME:
        await this.joinGame(ws, message.data)
        break
      case CheckersActionType.MOVE_FIGURE:
        await this.handleMove(ws, message.data)
        break
      case CheckersActionType.KILL_FIGURE:
        await this.killFigure(ws, message.data)
        break
      default:
        this.sendError(ws, 'Unknown message type')
    }
  }

  private async joinGame(
    ws: WebSocket,
    message: JoinGameRequestWebsocket['data']
  ): Promise<void> {
    const { username, id: gameId } = message
    const gameInDB = await prisma.game.findUnique({ where: { id: gameId } })

    if (!gameInDB) {
      this.sendError(ws, 'Game not found')
      return
    }

    const user = await prisma.user.findUnique({ where: { login: username } })

    if (!user) {
      this.sendError(ws, 'User not found')
      return
    }

    let currentUser = await prisma.gameParticipant.findUnique({
      where: { gameId_playerId: { gameId, playerId: user.id } }
    })

    if (!currentUser && gameInDB.status !== GameStatus.PENDING) {
      this.sendError(ws, 'Game is already full')
      return
    }

    if (!currentUser) {
      currentUser = await prisma.gameParticipant.create({
        data: {
          gameId,
          playerId: user.id,
          colorParticipant: {
            create: {
              color: 'black'
            }
          }
        }
      })
    }

    const participantColor = await this.getParticipantColor(currentUser.id)

    if (!participantColor) {
      this.sendError(ws, 'User color not found')
      return
    }

    this.attachClientToGame(ws, gameId, {
      userId: user.id,
      username,
      color: participantColor
    })

    const shouldStartGame =
      gameInDB.status === GameStatus.PENDING && participantColor === 'black'
    const nextStatus = shouldStartGame
      ? GameStatus.PLAYING
      : (gameInDB.status as TGameStatus)

    if (shouldStartGame) {
      await prisma.game.update({
        where: { id: gameId },
        data: { status: GameStatus.PLAYING }
      })
    }
    await this.sendJoinState(ws, nextStatus)

    if (shouldStartGame) {
      await this.broadcastJoinState(gameId, GameStatus.PLAYING, ws)
    }
  }

  private async handleMove(
    ws: WebSocket,
    message: MoveFigureRequestWebsocket['data']
  ): Promise<void> {
    const { startCell, finishCell } = message
    const connection = this.connectionState.get(ws)

    if (!connection) {
      this.sendError(ws, 'Socket is not connected to this game')
      return
    }

    const { gameId } = connection

    const gameInDB = await prisma.game.findUnique({ where: { id: gameId } })

    if (!gameInDB) {
      this.sendError(ws, 'Game not found')
      return
    }

    const currentCheckersGame = await prisma.checkersGame.findUnique({
      where: { gameId: gameInDB.id }
    })

    if (!currentCheckersGame) {
      this.sendError(ws, 'Game not found')
      return
    }

    const updatedCheckersGame = await prisma.checkersGame.update({
      where: { id: currentCheckersGame.id },
      data: {
        currentTurn:
          currentCheckersGame.currentTurn === 'white' ? 'black' : 'white'
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
      this.sendError(ws, 'Socket is not connected to this game')
      return
    }

    const { gameId } = connection

    const gameInDB = await prisma.game.findUnique({ where: { id: gameId } })

    if (!gameInDB) {
      this.sendError(ws, 'Game not found')
      return
    }

    const currentCheckersGame = await prisma.checkersGame.findUnique({
      where: { gameId: gameInDB.id }
    })

    if (!currentCheckersGame) {
      this.sendError(ws, 'Game not found')
      return
    }

    const updatedCheckersGame = await prisma.checkersGame.update({
      where: { id: currentCheckersGame.id },
      data: {
        currentTurn:
          currentCheckersGame.currentTurn === 'white' ? 'black' : 'white'
      }
    })

    this.broadcastToRoom(gameId, {
      type: CheckersActionType.KILL_FIGURE,
      data: {
        startCell,
        finishCell,
        figureId,
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
      this.gameRooms.delete(connection.gameId)
      this.connectionState.delete(ws)
    }
  }

  private handleDisconnect(ws: WebSocket): void {
    this.detachClientFromGame(ws)
    this.connectionState.delete(ws)
  }

  private async getParticipantColor(
    participantId: number
  ): Promise<IFigure['color'] | null> {
    const userWithColor = await prisma.gameWithColorParticipant.findUnique({
      where: { participantId }
    })

    return (userWithColor?.color as IFigure['color'] | undefined) ?? null
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
      this.sendError(ws, 'Game not found')
      return
    }

    const { gameId, color: userColor } = checkersGameGeneralData

    const checkersGameDB = await prisma.checkersGame.findUnique({
      where: { gameId }
    })

    if (!checkersGameDB) {
      this.sendError(ws, 'Game not found')
      return
    }

    const { currentTurn, mode, figures } = checkersGameDB

    this.sendJson(ws, {
      type: CheckersActionType.JOIN_GAME,
      data: {
        status,
        mode,
        figures,
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
