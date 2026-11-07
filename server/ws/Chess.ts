import { CheckersActionType } from '@game-workspace/checkers'

import prisma from '../prisma/prismaClient'
import { BoardSocketServiceConstructor } from '../ws/Board'
import { CommonWsMethods } from '../ws/Common'

import type { Game } from '@prisma/client'
import type { WebSocket } from 'ws'

class ChessSocketServiceConstructor extends BoardSocketServiceConstructor {
  async gameInfo(ws: WebSocket, gameId: Game['id']): Promise<void> {
    const chessGame = await prisma.chessGame.findUnique({
      where: { gameId }
    })

    if (!chessGame) {
      return CommonWsMethods.sendError(ws, 'Chess game not found')
    }

    CommonWsMethods.sendJson(ws, {
      type: CheckersActionType.GAME_INFO,
      data: { mode: chessGame.mode }
    })
  }
}

export const ChessSocketService = new ChessSocketServiceConstructor()
