import { gameService } from '../services/gameService.ts'
import { RequestHandler } from 'express'

interface IGameController {
  createGame: RequestHandler
}

export const gameController: IGameController = {
  async createGame(req, res, next) {
    try {
      const { type } = req.body

      // if (type && req.user) {
      //   const { gameType, gameId } = await gameService.createGame(req.user.id, type);
      //   return res.redirect(`/${gameType.toLowerCase()}/${gameId}`)
      // }
    } catch(e) {
      next(e)
    }
  },
}