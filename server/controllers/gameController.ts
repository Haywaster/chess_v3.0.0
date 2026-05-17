import { type RequestHandler } from 'express'

import { gameService } from '../services/gameService'

interface IGameController {
  createGame: RequestHandler
}

export const gameController: IGameController = {
  async createGame(req, res, next) {
    try {
      if (req.body && req.user) {
        const { gameId } = await gameService.createGame(req.user.id, req.body)
        return res.json(gameId)
      }
    } catch (e) {
      next(e)
    }
  }
}
