import { type IGame } from 'entities/Game'
import { RouterPath } from 'shared/const/router'

export const games: IGame[] = [
  {
    title: 'checkers',
    route: RouterPath.Checkers
  },
  {
    title: 'chess',
    route: RouterPath.Chess
  }
]
