/* eslint-disable no-console */
import { type RawData, type WebSocket, WebSocketServer } from 'ws'

import {
  type JoinGameRequestWebsocket,
  type MoveFigureRequestWebsocket,
  type KillFigureRequestWebsocket,
  CheckersActionType
} from '@game-workspace/checkers'
import {
  GameStatus,
  GameType,
  type TGameType,
  type GameInfoRequestWebsocket
} from '@game-workspace/shared'

import prisma from '../prisma/prismaClient'
import { CheckersSocketService } from '../ws/Checkers'
import { ChessSocketService } from '../ws/Chess'
import { CommonWsMethods } from '../ws/Common'
import { RoomManager } from '../ws/RoomManager'

import type { Game } from '@prisma/client'
import type { Server } from 'http'

type CommonWebsocketMessage =
  | GameInfoRequestWebsocket
  | JoinGameRequestWebsocket
type BoardWebsocketMessage =
  | MoveFigureRequestWebsocket
  | KillFigureRequestWebsocket
type IncomingWebsocketMessage = CommonWebsocketMessage | BoardWebsocketMessage

class GameWebSocketService {
  private readonly wss: WebSocketServer

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server })
    this.initializeHandlers()
  }

  private initializeHandlers(): void {
    this.wss.on('connection', ws => {
      RoomManager.connectionState.set(ws, null)
      console.log('New WebSocket connection')

      ws.on('message', (rawData: RawData) => {
        try {
          const message = JSON.parse(
            rawData.toString()
          ) as IncomingWebsocketMessage
          this.directMessage(ws, message)
        } catch (error) {
          console.error('Failed to parse message:', error)
          CommonWsMethods.sendError(ws, 'Invalid message')
        }
      })

      ws.on('close', () => {
        RoomManager.handleDisconnect(ws)
        console.log('WebSocket disconnected')
      })

      ws.on('error', error => {
        console.error('WebSocket error:', error)
      })
    })
  }

  private directMessage(
    ws: WebSocket,
    message: IncomingWebsocketMessage
  ): void {
    switch (message.type) {
      case CheckersActionType.GAME_INFO:
        this.gameInfo(ws, message.data.id)
        break
      case CheckersActionType.JOIN_GAME:
        this.joinGame(ws, message.data)
        break
      default: {
        // В default будут только методы требующие ws соединения или неизвестные методы
        const connectionState = RoomManager.connectionState.get(ws)

        if (!connectionState) {
          return CommonWsMethods.sendError(ws, 'There is no ws connection')
        }

        switch (connectionState.gameType) {
          case GameType.CHECKERS: {
            switch (message.type) {
              case CheckersActionType.MOVE_FIGURE:
                CheckersSocketService.moveFigure(ws, message.data)
                break
              case CheckersActionType.KILL_FIGURE:
                CheckersSocketService.killFigure(ws, message.data)
                break
              default:
                CommonWsMethods.sendError(ws, 'Unknown message type')
                break
            }
            break
          }
          case GameType.CHESS: {
            switch (message.type) {
              case CheckersActionType.MOVE_FIGURE:
                // ChessSocketService.moveFigure(ws, message.data)
                break
              case CheckersActionType.KILL_FIGURE:
                // ChessSocketService.killFigure(ws, message.data)
                break
              default:
                CommonWsMethods.sendError(ws, 'Unknown message type')
                break
            }
            break
          }
          default:
            CommonWsMethods.sendError(ws, 'Unknown game type')
            break
        }
      }
    }
  }

  private async gameInfo(ws: WebSocket, gameId: Game['id']): Promise<void> {
    const game = await CommonWsMethods.getGameWithGameTypeById(gameId, ws)

    if (!game) {
      return
    }

    switch (game.name as TGameType) {
      case GameType.CHECKERS: {
        await CheckersSocketService.gameInfo(ws, gameId)
        break
      }
      case GameType.CHESS: {
        await ChessSocketService.gameInfo(ws, gameId)
        break
      }
    }
  }

  private async joinGame(
    ws: WebSocket,
    message: JoinGameRequestWebsocket['data']
  ): Promise<void> {
    const { username, id: gameId } = message
    const game = await CommonWsMethods.getGameWithGameTypeById(gameId, ws)
    const currentUser = await CommonWsMethods.getUserByLogin(username, ws)

    if (!game || !currentUser) {
      return
    }

    const participants = await prisma.gameParticipant.findMany({
      where: { gameId }
    })

    if (game.status === GameStatus.PLAYING) {
      return CommonWsMethods.sendError(ws, 'Game is already full')
    }

    const joinGameData = { game, participants, currentUser }

    switch (game.name as TGameType) {
      case GameType.CHECKERS: {
        await CheckersSocketService.joinGame(ws, joinGameData)
        break
      }
    }
  }
}

export default GameWebSocketService
