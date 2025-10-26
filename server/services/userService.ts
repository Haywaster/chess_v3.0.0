import bcrypt from 'bcrypt'
import { tokenService } from '../services/tokenService.ts'
import prisma from '../prisma/prismaClient.ts'
import { ApiError } from '../exceptions/api-error.ts'
import type { User, RefreshToken } from '../types/scheme.ts'

export const authErrors = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  WRONG_PASSWORD: 'WRONG_PASSWORD',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS'
} as const

export const userService = {
  async registration(login: User['login'], password: User['password']) {
    const candidate = await prisma.user.findUnique({ where: { login } })

    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с login ${login} уже существует`, authErrors.USER_ALREADY_EXISTS)
    }
    
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({ data: { login, password: hashPassword } })
    const tokens = tokenService.generate(newUser)
    await tokenService.saveToken(newUser.id, tokens.refreshToken)

    return {...tokens, user: login}
  },

  async login(login: User['login'], password: User['password']) {
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

  async refresh(refreshToken: RefreshToken['refreshToken'] | null) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }

    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenService.findToken(refreshToken)

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError()
    }

    const user = await prisma.user.findUnique({ where: { id: userData.id } })
    
    if (!user) {
      throw ApiError.BadRequest('Пользователь не найден', authErrors.USER_NOT_FOUND)
    }
    
    const tokens = tokenService.generate(user)

    await tokenService.saveToken(user.id, tokens.refreshToken)

    return {...tokens, user: user.login}
  },

  async getAllUsers() {
    return await prisma.user.findMany();
  }
}