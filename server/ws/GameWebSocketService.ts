import { Server } from 'http'

import { WebSocketServer, WebSocket, type RawData } from 'ws'

import prisma from '../prisma/prismaClient.ts'
import { GameStatus, GameType } from '../services/gameService.ts'

const ActionType = {
  JOIN_GAME: 'JOIN_GAME',
  MOVE_FIGURE: 'MOVE_FIGURE',
  SAVE_GAME: 'SAVE_GAME',
  ERROR: 'ERROR'
} as const

type EnumValues<
  T extends Record<string, string | number> | ReadonlyArray<string | number>
> = T extends ReadonlyArray<string | number> ? T[number] : T[keyof T]

export type TGameType = EnumValues<typeof GameType>
type TGameStatus = EnumValues<typeof GameStatus>

interface ICheckersUserData {
  color: IFigure['color']
}

interface IGame {
  id: string
  type: TGameType
  status: TGameStatus
  userData: ICheckersUserData
}

interface IFigure {
  id: number
  x: number
  y: number
  color: 'white' | 'black'
  isStain: boolean
  cellId: ICell['id']
}

interface ICell {
  id: number
  x: number
  y: number
  color: 'white' | 'black'
  figureId?: IFigure['id']
}

interface IJoinGameData {
  username: string
  game: Omit<IGame, 'status'>
}

interface IMoveFigure {
  startCell: ICell
  finishCell: ICell
  gameId: IGame['id']
}

interface ISaveGameData {
  gameId: IGame['id']
  figures: IFigure[]
  cells: ICell[]
}

interface WebsocketDataConstructor<T = string, D = Record<string, unknown>> {
  type: T
  data: D
}

type JoinGameRequestWebsocket = WebsocketDataConstructor<
  typeof ActionType.JOIN_GAME,
  IJoinGameData
>
type MoveFigureRequestWebsocket = WebsocketDataConstructor<
  typeof ActionType.MOVE_FIGURE,
  IMoveFigure
>
type SaveGameRequestWebsocket = WebsocketDataConstructor<
  typeof ActionType.SAVE_GAME,
  ISaveGameData
>

type IncomingWebsocketMessage =
  | JoinGameRequestWebsocket
  | MoveFigureRequestWebsocket
  | SaveGameRequestWebsocket

interface IConnectionState {
  gameId: string | null
  userId: number | null
  username: string | null
  color: IFigure['color'] | null
}

class GameWebSocketService {
  private readonly wss: WebSocketServer

  private readonly gameRooms = new Map<string, Set<WebSocket>>()

  private readonly connectionState = new Map<WebSocket, IConnectionState>()

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server })
    this.initializeHandlers()
  }

  private initializeHandlers(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      this.connectionState.set(ws, {
        gameId: null,
        userId: null,
        username: null,
        color: null
      })
      console.log('New WebSocket connection')

      ws.on('message', async (rawData: RawData) => {
        try {
          const message = JSON.parse(rawData.toString()) as IncomingWebsocketMessage
          await this.handleMessage(ws, message)
        } catch (error) {
          console.error('Failed to parse message:', error)
          this.sendError(ws, 'Invalid message')
        }
      })

      ws.on('close', () => {
        this.handleDisconnect(ws)
        console.log('WebSocket disconnected')
      })

      ws.on('error', (error) => {
        console.error('WebSocket error:', error)
      })
    })
  }

  private async handleMessage(
    ws: WebSocket,
    message: IncomingWebsocketMessage
  ): Promise<void> {
    switch (message.type) {
      case ActionType.JOIN_GAME:
        await this.joinGame(ws, message.data)
        break
      case ActionType.MOVE_FIGURE:
        await this.handleMove(ws, message.data)
        break
      case ActionType.SAVE_GAME:
        await this.saveGameScheme(ws, message.data)
        break
      default:
        this.sendError(ws, 'Unknown message type')
    }
  }

  private async joinGame(ws: WebSocket, message: IJoinGameData): Promise<void> {
    const { game, username } = message
    const gameId = game.id
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
    const nextStatus = shouldStartGame ? GameStatus.PLAYING : gameInDB.status as EnumValues<typeof GameStatus>

    if (shouldStartGame) {
      await prisma.game.update({
        where: { id: gameId },
        data: { status: GameStatus.PLAYING }
      })
    }

    this.sendJoinState(ws, game, nextStatus, participantColor)

    if (shouldStartGame) {
      this.broadcastJoinState(gameId, game, GameStatus.PLAYING, ws)
    }
  }

  private async handleMove(ws: WebSocket, message: IMoveFigure): Promise<void> {
    const { gameId, startCell, finishCell } = message
    const connection = this.connectionState.get(ws)

    if (!connection || connection.gameId !== gameId) {
      this.sendError(ws, 'Socket is not connected to this game')
      return
    }

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
        currentTurn: currentCheckersGame.currentTurn === 'white' ? 'black' : 'white'
      }
    })

    this.broadcastToRoom(gameId, {
      type: ActionType.MOVE_FIGURE,
      data: {
        startCell,
        finishCell,
        currentTurn: updatedCheckersGame.currentTurn
      }
    })
  }

  private async saveGameScheme(
    ws: WebSocket,
    message: ISaveGameData
  ): Promise<void> {
    const { gameId, figures, cells } = message
    const connection = this.connectionState.get(ws)

    if (!connection || connection.gameId !== gameId) {
      this.sendError(ws, 'Socket is not connected to this game')
      return
    }

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
      data: { figures: JSON.stringify({ figures, cells }) }
    })

    this.broadcastToRoom(gameId, {
      type: ActionType.SAVE_GAME,
      data: updatedCheckersGame
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
    this.connectionState.set(ws, {
      gameId,
      userId: params.userId,
      username: params.username,
      color: params.color
    })
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
    }

    this.connectionState.set(ws, {
      ...connection,
      gameId: null
    })
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

  private broadcastJoinState(
    gameId: string,
    game: Omit<IGame, 'status'>,
    status: TGameStatus,
    excludeWs?: WebSocket
  ): void {
    const room = this.gameRooms.get(gameId)

    if (!room) {
      return
    }

    room.forEach((client) => {
      if (client === excludeWs) {
        return
      }

      const connection = this.connectionState.get(client)

      if (!connection?.color) {
        return
      }

      this.sendJoinState(client, game, status, connection.color)
    })
  }

  private sendJoinState(
    ws: WebSocket,
    game: Omit<IGame, 'status'>,
    status: TGameStatus,
    color: IFigure['color']
  ): void {
    this.sendJson(ws, {
      type: ActionType.JOIN_GAME,
      data: {
        ...game,
        status,
        userData: {
          color
        }
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

    room.forEach((client) => {
      if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
        this.sendJson(client, message)
      }
    })
  }

  private sendError(ws: WebSocket, error: string): void {
    this.sendJson(ws, { type: ActionType.ERROR, error })
  }

  private sendJson(ws: WebSocket, payload: Record<string, unknown>): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload))
    }
  }
}

export default GameWebSocketService
