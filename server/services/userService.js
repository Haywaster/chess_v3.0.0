import bcrypt from 'bcrypt'
import { tokenService } from './tokenService.js'
import prisma from '../prisma/prismaClient.js'
import { ApiError } from '../exceptions/api-error.js'

export const authErrors = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  WRONG_PASSWORD: 'WRONG_PASSWORD',
}

export const userService = {
  async registration(login, password) {
    const candidate = await prisma.user.findUnique({ where: { login } })

    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с login ${login} уже существует`)
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({ data: { login, password: hashPassword } })
    const tokens = tokenService.generate(newUser)
    await tokenService.saveToken(newUser.id, tokens.refreshToken)

    return {...tokens, user: login}
  },

  async login(login, password) {
    const candidate = await prisma.user.findUnique({ where: { login } })

    if (!candidate) {
      throw ApiError.BadRequest(`Пользователь с login ${login} не найден`, authErrors.USER_NOT_FOUND)
    }

    const isCompare = await bcrypt.compare(password, candidate.password)

    if (!isCompare) {
      throw ApiError.BadRequest(`Для пользователя ${login} неверно указан пароль`, authErrors.WRONG_PASSWORD)
    }

    const tokens = tokenService.generate(candidate)
    await tokenService.saveToken(candidate.id, tokens.refreshToken)

    return {...tokens, user: login}
  },

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }

    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenService.findToken(refreshToken)

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError()
    }

    const user = await prisma.user.findUnique({ where: { id: userData.id } })
    const tokens = tokenService.generate(user)

    await tokenService.saveToken(user.id, tokens.refreshToken)

    return {...tokens, user: user.login}
  },

  async getAllUsers() {
    return await prisma.user.findMany();
  }
}