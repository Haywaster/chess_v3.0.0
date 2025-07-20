import type { RouteObject } from 'react-router-dom'

import { Checkers } from 'pages/Checkers'
import { Main } from 'pages/Main'
import { id, RouterPath } from 'shared/const/router'

const getRouteWithId = (route: string, id?: string): string =>
  id ? `${route}/:${id}` : route

export const AppRouter: RouteObject[] = [
  {
    path: RouterPath.Home,
    element: <Main />
  },
  {
    path: getRouteWithId(RouterPath.Checkers, id),
    element: <Checkers />
  }
]
