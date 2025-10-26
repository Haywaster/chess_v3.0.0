import prisma from '../prisma/prismaClient.js'
import { ApiError } from '../exceptions/api-error.js'

const gameTypes = {
  CHECKERS: 'CHECKERS',
  CHESS: 'CHESS',
}

export const gameService = {
  async createGame(userId, type) {
    if (!(type in gameTypes)) {
      throw ApiError.BadRequest('Тип игры указан неверно')
    }

    const { name: gameType } = await prisma.gameType.upsert({
      where: { name: type },
      update: {},
      create: { name: type }
    });

    const createGameObj = {
      data: {
        type: gameType,
        status: 'waiting',
        playerGames: {
          create: [
            {
              userId,
              figureColor: 'white'
            },
          ]
        },
        checkersGame: {
          create: {
            lastMove: 'white',
            figures: '[]'
          }
        }
      },
      include: {
        playerGames: {
          include: {
            user: {
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
    }

    if (gameType === gameTypes.CHESS) {

    }

    const data = await prisma.game.create({
      data: {
        type: gameType,
        status: 'waiting',
        playerGames: {
          create: [
            {
              userId,
              figureColor: 'white'
            },
          ]
        },
        checkersGame: {
          create: {
            lastMove: 'white',
            figures: '[]'
          }
        }
      },
      include: {
        playerGames: {
          include: {
            user: {
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