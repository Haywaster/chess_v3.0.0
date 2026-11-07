import {
  changeBoardAfterKill,
  changeBoardAfterMove,
  CheckersActionType,
  type IBoard,
  type IFigure,
  initialBoard,
  type JoinGameResponseWebsocket,
  type KillFigureRequestWebsocket,
  type MoveFigureRequestWebsocket
} from '@game-workspace/checkers'

import prisma from '../prisma/prismaClient'
import { BoardSocketServiceConstructor } from '../ws/Board'
import { CommonWsMethods } from '../ws/Common'
import { RoomManager, type UpdateGameData } from '../ws/RoomManager'

import type {
  CheckersGame,
  Game,
  GameParticipant,
  GameType,
  User
} from '@prisma/client'
import type { WebSocket } from 'ws'

type UpdateCheckersGameData = Omit<UpdateGameData, 'newParticipantData'> & {
  checkersGame: CheckersGame
}

interface JoinGameData {
  currentUser: User
  participants: GameParticipant[]
  game: Game & Omit<GameType, 'id'>
}

export interface ICheckersConnectionState {
  userColor: IFigure['color']
}

class CheckersSocketServiceConstructor extends BoardSocketServiceConstructor {
  private async getCheckersGameById(
    gameId: Game['id'],
    ws: WebSocket
  ): Promise<CheckersGame | null> {
    const checkersGame = await prisma.checkersGame.findUnique({
      where: { gameId }
    })

    if (!checkersGame) {
      CommonWsMethods.sendError(ws, 'Checkers game not found')
      return null
    }

    return checkersGame
  }

  private async joinParticipant(
    ws: WebSocket,
    { game, user, checkersGame }: UpdateCheckersGameData
  ): Promise<void> {
    const { currentTurn, board } = checkersGame

    const newParticipantData: Omit<
      JoinGameResponseWebsocket['data'],
      'status'
    > = {
      board: typeof board === 'string' ? JSON.parse(board) : initialBoard,
      currentTurn: currentTurn as IFigure['color'],
      userColor: user.color
    }

    await RoomManager.joinParticipant(ws, { game, user, newParticipantData })
  }

  async gameInfo(ws: WebSocket, gameId: Game['id']): Promise<void> {
    const checkersGame = await this.getCheckersGameById(gameId, ws)

    if (!checkersGame) {
      return
    }

    CommonWsMethods.sendJson(ws, {
      type: CheckersActionType.GAME_INFO,
      data: { mode: checkersGame.mode }
    })
  }

  async joinGame(
    ws: WebSocket,
    { game, participants, currentUser }: JoinGameData
  ): Promise<void> {
    const checkersGame = await this.getCheckersGameById(game.id, ws)

    if (!checkersGame) {
      return
    }

    const participant = participants.find(
      item => item.playerId === currentUser.id
    )

    // Игрок не найден
    if (!participant) {
      // Создаем пользователя и подключаем его в комнату
      const { id: firstParticipantId } = participants[0]
      const firstUserWithColor = await this.getUserWithColorByParticipantId(
        firstParticipantId,
        ws
      )

      if (!firstUserWithColor) {
        return
      }

      // Цвет фигур противоположен первому участнику
      const participantColor = (
        firstUserWithColor.color === 'white' ? 'black' : 'white'
      ) as IFigure['color']

      await prisma.gameParticipant.create({
        data: {
          gameId: game.id,
          playerId: currentUser.id,
          colorParticipant: {
            create: {
              color: participantColor
            }
          }
        }
      })

      await this.joinParticipant(ws, {
        game,
        checkersGame,
        user: { ...currentUser, color: participantColor }
      })
      // Игрок найден
    } else {
      const participantWithColor = await this.getUserWithColorByParticipantId(
        participant.id,
        ws
      )

      if (!participantWithColor) {
        return
      }

      await this.joinParticipant(ws, {
        game,
        checkersGame,
        user: {
          ...currentUser,
          color: participantWithColor.color as IFigure['color']
        }
      })
    }
  }

  async getBoardAfterMove(
    ws: WebSocket,
    message: MoveFigureRequestWebsocket['data']
  ): Promise<
    | (IBoard & {
        currentTurn: CheckersGame['currentTurn']
        gameId: Game['id']
      })
    | null
  > {
    const { startCell, finishCell } = message

    const connection = RoomManager.connectionState.get(ws)

    if (!connection) {
      CommonWsMethods.sendError(ws, 'Socket is not connected to this game')
      return null
    }

    const { gameId } = connection

    const currentCheckersGame = await this.getCheckersGameById(gameId, ws)

    if (!currentCheckersGame) {
      return null
    }

    const { board, currentTurn } = currentCheckersGame

    const typedBoard = (
      typeof board === 'string' ? JSON.parse(board) : null
    ) as IBoard | null

    if (!typedBoard) {
      CommonWsMethods.sendError(ws, 'Board not found')
      return null
    }

    const boardAfterMove = changeBoardAfterMove(
      startCell.id,
      finishCell.id,
      typedBoard
    )

    return { ...boardAfterMove, currentTurn, gameId }
  }

  async moveFigure(
    ws: WebSocket,
    message: MoveFigureRequestWebsocket['data']
  ): Promise<void> {
    const boardAfterMove = await this.getBoardAfterMove(ws, message)

    if (!boardAfterMove) {
      return
    }

    const { currentTurn, gameId } = boardAfterMove

    const updatedCheckersGame = await prisma.checkersGame.update({
      where: { gameId },
      data: {
        currentTurn: currentTurn === 'white' ? 'black' : 'white',
        board: JSON.stringify(boardAfterMove)
      }
    })

    RoomManager.broadcastToRoom(gameId, {
      type: CheckersActionType.MOVE_FIGURE,
      data: { ...message, currentTurn: updatedCheckersGame.currentTurn }
    })
  }

  async killFigure(
    ws: WebSocket,
    message: KillFigureRequestWebsocket['data']
  ): Promise<void> {
    const { startCell, finishCell, figureId } = message
    const boardAfterMove = await this.getBoardAfterMove(ws, message)

    if (!boardAfterMove) {
      return
    }

    const { currentTurn, gameId } = boardAfterMove

    const boardAfterKill = changeBoardAfterKill(figureId, boardAfterMove)

    const updatedCheckersGame = await prisma.checkersGame.update({
      where: { gameId },
      data: {
        currentTurn: currentTurn === 'white' ? 'black' : 'white',
        board: JSON.stringify(boardAfterKill)
      }
    })

    RoomManager.broadcastToRoom(gameId, {
      type: CheckersActionType.KILL_FIGURE,
      data: {
        figureId,
        startCell,
        finishCell,
        currentTurn: updatedCheckersGame.currentTurn
      }
    })
  }
}

export const CheckersSocketService = new CheckersSocketServiceConstructor()
