import type { RouteObject } from 'react-router-dom'

import { Main as MainPage } from 'pages/Main'

enum RouterPath {
  Home = '/'
}

export const AppRouter: RouteObject[] = [
  {
    path: RouterPath.Home,
    element: <MainPage />
  }
]
