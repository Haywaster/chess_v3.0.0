import { RouterPath } from 'shared/const/router'
import { type IGame } from 'widgets/VideoLinks'

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
