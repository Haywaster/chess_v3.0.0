import prisma from '../prisma/prismaClient.ts'
import { ApiError } from '../exceptions/api-error.ts'

const gameTypes = {
  CHECKERS: 'CHECKERS',
  CHESS: 'CHESS',
} as const

const errors = {
  INCORRECT_GAME: 'INCORRECT_GAME',
}

export const gameService = {
  async createGame(userId: number, type: string) {
    if (!(type in gameTypes)) {
      throw ApiError.BadRequest('Тип игры указан неверно', errors.INCORRECT_GAME)
    }

    const { id: gameTypeId } = await prisma.gameType.upsert({
      where: { name: type },
      update: {},
      create: { name: type, minPlayers: 2, maxPlayers: 2 },
    });

    const data = await prisma.game.create({
      data: {
        gameTypeId,
        status: 'waiting',
        participants: {
          create: [
            {
              playerId: userId,
              colorParticipant: {
                create: {
                  color: 'white'
                }
              }
            },
          ]
        },
        checkersGame: {
          create: {
            currentTurn: 'white',
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
    });

    return { gameId: data.id, gameType: type }
  }
}