import { GameType, type IGameIntroduction } from 'entities/Game'
import { RouterPath } from 'shared/const/router'

export const games: IGameIntroduction[] = [
  {
    title: GameType.CHECKERS,
    route: RouterPath.CHECKERS
  },
  {
    title: GameType.CHESS,
    route: RouterPath.CHESS
  }
]
