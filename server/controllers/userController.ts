import { type RequestHandler } from 'express'

import { getTimeIn, StatusCodes } from '@game-workspace/shared'

import { userService } from '../services/userService'

interface IUserController {
  registration: RequestHandler
  login: RequestHandler
  refresh: RequestHandler
  getAllUsers: RequestHandler
  logout: RequestHandler
}

const MAX_DAYS = 30
const MAX_AGE_MS = getTimeIn(MAX_DAYS, 'DAY', 'MS')

export const userController: IUserController = {
  async registration(req, res, next) {
    const { login, password } = req.body

    try {
      //      const errors = validationResult(req)
      //      if (!errors.isEmpty()) {
      //        return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
      //      }
      const userData = await userService.registration(login, password)
      res.cookie('refreshToken', userData.refreshToken, {
        httpOnly: true,
        maxAge: MAX_AGE_MS
      })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  },
  async login(req, res, next) {
    const { login, password } = req.body

    try {
      const userData = await userService.login(login, password)
      res.cookie('refreshToken', userData.refreshToken, {
        httpOnly: true,
        maxAge: MAX_AGE_MS
      })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  },

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const userData = await userService.refresh(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, {
        httpOnly: true,
        maxAge: MAX_AGE_MS
      })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  },

  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers()
      return res.json(users)
    } catch (e) {
      next(e)
    }
  },

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      await userService.logout(refreshToken)
      res.clearCookie('refreshToken')
      return res.sendStatus(StatusCodes.SUCCESS)
    } catch (e) {
      next(e)
    }
  }
}
