import { userService } from '../services/userService.js'

export const userController = {
  async registration(req, res, next) {
    const { login, password} = req.body

    try {
//      const errors = validationResult(req)
//      if (!errors.isEmpty()) {
//        return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
//      }
      const userData = await userService.registration(login, password)
      res.cookie('refreshToken', userData.refreshToken, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000})
      return res.json(userData)
    } catch(e) {
      next(e)
    }
  },
  async login(req, res, next) {
    const { login, password} = req.body

    try {
      const userData = await userService.login(login, password)
      res.cookie('refreshToken', userData.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  },

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const userData = await userService.refresh(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000})
      return res.json(userData)
    } catch(e) {
      next(e)
    }
  },

  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers()
      return res.json(users)
    } catch(e) {
      next(e)
    }
  },
}