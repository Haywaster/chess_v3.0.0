import { WebSocket } from 'ws'

import { CheckersActionType } from '@game-workspace/checkers'

import prisma from '../prisma/prismaClient'

import type { Game, GameType, User } from '@prisma/client'

export const CommonWsMethods = {
  sendError(ws: WebSocket, error: string): void {
    this.sendJson(ws, { type: CheckersActionType.ERROR, error })
  },
  sendJson<T extends object>(ws: WebSocket, payload: T): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload))
    }
  },
  async getGameWithGameTypeById(
    gameId: Game['id'],
    ws: WebSocket
  ): Promise<(Game & Omit<GameType, 'id'>) | null> {
    const game = await prisma.game.findUnique({ where: { id: gameId } })

    if (!game) {
      this.sendError(ws, 'Game not found')
      return null
    }

    const gameType = await prisma.gameType.findUnique({
      where: { id: game.gameTypeId }
    })

    if (!gameType) {
      this.sendError(ws, 'The type of game does not exist')
      return null
    }

    const { id: _, ...restGameType } = gameType

    return { ...game, ...restGameType }
  },
  async getUserByLogin(
    username: User['login'],
    ws: WebSocket
  ): Promise<User | null> {
    const currentUser = await prisma.user.findUnique({
      where: { login: username }
    })

    if (!currentUser) {
      this.sendError(ws, 'User not found')
      return null
    }

    return currentUser
  }
}
