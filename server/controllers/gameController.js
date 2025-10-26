import { gameService } from '../services/gameService.js'

export const gameController = {
  async createGame(req, res, next) {
    try {
      const { type } = req.body

      if (type) {
        const { gameType, gameId } = await gameService.createGame(req.user.id, type);
        return res.redirect(`/${gameType.toLowerCase()}/${gameId}`)
      }
    } catch(e) {
      next(e)
    }
  },
}