import { WebSocket } from 'ws'

import {
  type IFigure,
  type JoinGameResponseWebsocket
} from '@game-workspace/checkers'
import {
  GameStatus,
  GameActionType,
  type IGeneralGame,
  type TGameStatus,
  type TGameType,
  type MessageResponseWebsocket,
  type ChangeStatusResponseWebsocket
} from '@game-workspace/shared'

import prisma from '../prisma/prismaClient'
import { type ICheckersConnectionState } from '../ws/Checkers'
import { CommonWsMethods } from '../ws/Common'

import type { Game, GameType, User } from '@prisma/client'

export interface UpdateGameData {
  user: Pick<User, 'id' | 'login'> & Pick<IFigure, 'color'>
  game: Pick<Game, 'id' | 'status'> & Pick<GameType, 'name' | 'maxPlayers'>
  newParticipantData: object
}

export interface IConnectionState {
  gameId: IGeneralGame['id']
  gameType: TGameType
  userId: User['id']
  username: User['login']
  checkersState?: ICheckersConnectionState
}

export interface IExcludeWS<T extends object | (() => void)> {
  ws: WebSocket
  message: T | null
}

type TMessage = object | ((ws: WebSocket) => void)

// Обращаемся к RoomManager тогда и только тогда, когда пользователь существует в комнате
class RoomManagerConstructor {
  readonly gameRooms = new Map<IGeneralGame['id'], Set<WebSocket>>()
  readonly connectionState = new Map<WebSocket, IConnectionState | null>()

  broadcastToRoom<T extends TMessage, B extends TMessage>(
    gameId: IGeneralGame['id'],
    message: T,
    excludeWs?: IExcludeWS<B>
  ): void {
    const room = this.gameRooms.get(gameId)

    if (!room) {
      return
    }

    for (const client of room) {
      if (client.readyState !== WebSocket.OPEN) {
        continue
      }

      if (client !== excludeWs?.ws) {
        if (typeof message === 'object') {
          CommonWsMethods.sendJson(client, message)
        } else {
          message(client)
        }
      } else {
        const { message } = excludeWs

        if (!message) {
          continue
        }

        if (typeof message === 'object') {
          CommonWsMethods.sendJson(client, message)
        } else {
          message(client)
        }
      }
    }
  }

  sendMessage<T extends MessageResponseWebsocket['data']>(
    gameId: IGeneralGame['id'],
    message: T,
    excludeWs?: IExcludeWS<T>
  ): void {
    this.broadcastToRoom(
      gameId,
      {
        type: GameActionType.MESSAGE,
        data: message
      },
      excludeWs
    )
  }

  detachClientFromGame(ws: WebSocket): void {
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

  protected attachClientToGame(ws: WebSocket, data: IConnectionState): void {
    this.detachClientFromGame(ws)

    const room = this.gameRooms.get(data.gameId) ?? new Set<WebSocket>()
    room.add(ws)
    this.gameRooms.set(data.gameId, room)
    this.connectionState.set(ws, data)
  }

  async joinParticipant(
    ws: WebSocket,
    { game, user, newParticipantData }: UpdateGameData
  ): Promise<void> {
    this.attachClientToGame(ws, {
      gameId: game.id,
      gameType: game.name as TGameType,
      userId: user.id,
      username: user.login,
      checkersState: {
        userColor: user.color
      }
    })

    const newStatus = (() => {
      const room = this.gameRooms.get(game.id)

      if (!room) {
        return game.status as TGameStatus
      }

      return room.size === game.maxPlayers
        ? GameStatus.PLAYING
        : GameStatus.PENDING
    })()

    await prisma.game.update({
      where: { id: game.id },
      data: { status: newStatus }
    })

    const participantData: ChangeStatusResponseWebsocket = {
      type: GameActionType.CHANGE_STATUS,
      data: { status: newStatus } as ChangeStatusResponseWebsocket['data']
    }

    const newUserData: JoinGameResponseWebsocket = {
      type: GameActionType.JOIN_GAME,
      data: {
        status: newStatus,
        ...newParticipantData
      } as JoinGameResponseWebsocket['data']
    }

    this.broadcastToRoom(game.id, participantData, { ws, message: newUserData })

    this.sendMessage(
      game.id,
      {
        type: 'success',
        message: `User ${user.login} connected`
      },
      { ws, message: null }
    )
  }

  async handleDisconnect(ws: WebSocket): Promise<void> {
    const connection = this.connectionState.get(ws)

    if (!connection?.gameId) {
      return
    }

    await prisma.game.update({
      where: { id: connection.gameId },
      data: { status: GameStatus.PENDING }
    })

    // Логика оповещения участников комнаты
    this.broadcastToRoom(
      connection.gameId,
      {
        type: GameActionType.CHANGE_STATUS,
        data: { status: GameStatus.PENDING }
      },
      { ws, message: null }
    )

    this.detachClientFromGame(ws)
    this.connectionState.delete(ws)
    this.sendMessage(connection.gameId, {
      type: 'error',
      message: 'User disconnected'
    })
  }
}

export const RoomManager = new RoomManagerConstructor()
