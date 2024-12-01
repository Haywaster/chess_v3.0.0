import type { RouteObject } from 'react-router-dom'

import { Main } from 'pages/Main'
import { RouterPath } from 'shared/const/router'

export const AppRouter: RouteObject[] = [
  {
    path: RouterPath.Home,
    element: <Main />
  }
]
