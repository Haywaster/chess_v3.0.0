import jwt from 'jsonwebtoken'
import prisma from '../prisma/prismaClient.js'

export const tokenService = {
  generate(user) {
    const accessToken = jwt.sign(user, process.env.JWT_ACCESS_SECRET_KEY, {expiresIn: '1h'})
    const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_SECRET_KEY, {expiresIn: '24h'})

    return { accessToken, refreshToken }
  },

  async saveToken(userId, refreshToken) {
    const tokenData = await prisma.refreshToken.findUnique({ where: { id: userId } });

    if (tokenData) {
      return prisma.refreshToken.update({
        where: { id: userId },
        data: { refresh_token: refreshToken },
      });
    }

    return prisma.refreshToken.create({
      data: { id: userId, refresh_token: refreshToken },
    });
  },

  validateAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY)
    } catch (e) {
      return null
    }
  },

  validateRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY)
    } catch (e) {
      return null
    }
  },

  async findToken(refreshToken) {
    return prisma.refreshToken.findUnique({ where: { refresh_token: refreshToken } })
  }
}