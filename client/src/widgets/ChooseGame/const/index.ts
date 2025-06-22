import { type IGameIntroduction } from 'entities/Game'
import { RouterPath } from 'shared/const/router'

export const games: IGameIntroduction[] = [
  {
    title: 'checkers',
    route: RouterPath.Checkers
  },
  {
    title: 'chess',
    route: RouterPath.Chess
  }
]
