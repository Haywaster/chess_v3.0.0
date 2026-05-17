import type { ICreateGameData } from '@game-workspace/checkers'
import { GameStatus, GameType } from '@game-workspace/shared'

import { ApiError } from '../exceptions/api-error'
import prisma from '../prisma/prismaClient'

const errors = {
  INCORRECT_GAME: 'INCORRECT_GAME'
}

export const gameService = {
  async createGame(userId: number, body: ICreateGameData) {
    if (!(body.type in GameType)) {
      throw ApiError.BadRequest(
        'Тип игры указан неверно',
        errors.INCORRECT_GAME
      )
    }

    const { id: gameTypeId } = await prisma.gameType.upsert({
      where: { name: body.type },
      update: {},
      create: { name: body.type, minPlayers: 2, maxPlayers: 2 }
    })

    const data = await prisma.game.create({
      data: {
        gameTypeId,
        status: GameStatus.PENDING,
        participants: {
          create: [
            {
              playerId: userId,
              colorParticipant: {
                create: {
                  color: body.userColor
                }
              }
            }
          ]
        },
        checkersGame: {
          create: {
            currentTurn: 'white',
            mode: body.mode
          }
        }
      },
      include: {
        participants: {
          include: {
            player: {
              select: {
                id: true,
                login: true
              }
            }
          }
        },
        checkersGame: true,
        gameType: true
      }
    })

    return { gameId: data.id, gameType: body.type }
  }
}
