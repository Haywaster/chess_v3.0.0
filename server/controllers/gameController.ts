import { type RequestHandler } from 'express'

import { getUserData } from '../middlewares/authMiddleware'
import { gameService } from '../services/gameService'

interface IGameController {
  createGame: RequestHandler
}

export const gameController: IGameController = {
  async createGame(req, res, next) {
    try {
      if (req.body) {
        const fullTokenStr = req.headers.authorization
        const userData = getUserData(fullTokenStr)
        const { gameId } = await gameService.createGame(userData?.id, req.body)
        return res.json(gameId)
      }
    } catch (e) {
      next(e)
    }
  }
}
