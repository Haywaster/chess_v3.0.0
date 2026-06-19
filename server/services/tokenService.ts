import jwt from 'jsonwebtoken'

import { getTimeIn, StatusCodes } from '@game-workspace/shared'

import { ApiError } from '../exceptions/api-error'
import prisma from '../prisma/prismaClient'

import type { User, RefreshToken } from '../types/scheme'

export const tokenService = {
  generate(user: User) {
    const accessKey = process.env.JWT_ACCESS_SECRET_KEY
    const refreshKey = process.env.JWT_REFRESH_SECRET_KEY

    if (!accessKey || !refreshKey) {
      throw new ApiError(
        StatusCodes.SERVER_ERROR,
        'Не удалось сгенерировать токены',
        'UnknownError'
      )
    }

    const accessToken = jwt.sign(user, accessKey, { expiresIn: '1h' })
    const refreshToken = jwt.sign(user, refreshKey, { expiresIn: '24h' })

    return { accessToken, refreshToken }
  },

  async saveToken(
    userId: User['id'],
    refreshToken: RefreshToken['refreshToken']
  ) {
    const tokenData = await prisma.refreshToken.findUnique({
      where: { userId }
    })

    if (tokenData) {
      return prisma.refreshToken.update({
        where: { userId },
        data: { refreshToken }
      })
    }

    return prisma.refreshToken.create({
      data: {
        userId,
        refreshToken,
        expiresAt: new Date(Date.now() + getTimeIn(1, 'DAY', 'MS'))
      }
    })
  },

  validateAccessToken(token: string): User | null {
    const accessKey = process.env.JWT_ACCESS_SECRET_KEY

    if (!accessKey) {
      throw new ApiError(
        StatusCodes.SERVER_ERROR,
        'Не удалось проверить токен',
        'UnknownError'
      )
    }

    try {
      return jwt.verify(token, accessKey) as User
    } catch {
      return null
    }
  },

  validateRefreshToken(token: RefreshToken['refreshToken']): User | null {
    const refreshKey = process.env.JWT_REFRESH_SECRET_KEY

    if (!refreshKey) {
      throw new ApiError(
        StatusCodes.SERVER_ERROR,
        'Не удалось проверить токен',
        'UnknownError'
      )
    }

    try {
      return jwt.verify(token, refreshKey) as User
    } catch {
      return null
    }
  },

  async findToken(refreshToken: RefreshToken['refreshToken']) {
    return prisma.refreshToken.findUnique({ where: { refreshToken } })
  },

  async removeToken(refreshToken: RefreshToken['refreshToken']) {
    return prisma.refreshToken.delete({ where: { refreshToken } })
  }
}
