import type { RouteObject } from 'react-router-dom'

import { Checkers } from 'pages/Checkers'
import { Main } from 'pages/Main'
import { id, RouterPath } from 'shared/const/router'

const getRouteWithId = (route: string, id?: string): string =>
  id ? `${route}/:${id}` : route

export const AppRouter: RouteObject[] = [
  {
    path: RouterPath.HOME,
    element: <Main />
  },
  {
    path: getRouteWithId(RouterPath.CHECKERS, id),
    element: <Checkers />
  }
]
